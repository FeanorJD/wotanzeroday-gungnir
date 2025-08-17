#!/usr/bin/env python3
"""
Wotanzeroday Gungnir - Advanced SOC Platform
Scanner inteligente con análisis de IA
Autor: Pablo Bobadilla
"""

import asyncio
import json
import subprocess
import requests
import os
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import nmap
import xml.etree.ElementTree as ET

# Modelos de datos
class ScanRequest(BaseModel):
    target: str
    scan_type: str = "aggressive"
    include_vulns: bool = True
    ai_analysis: bool = True

class AIAnalysisRequest(BaseModel):
    data: str
    analysis_type: str = "general"

# Configuración
@dataclass
class GungnirConfig:
    """Configuración principal de Gungnir"""
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    max_concurrent_scans: int = 5
    default_timeout: int = 300
    nuclei_path: str = "nuclei"
    nmap_path: str = "nmap"
    threat_intel_apis: Dict = field(default_factory=lambda: {
        "virustotal": os.getenv("VIRUSTOTAL_API_KEY", ""),
        "shodan": os.getenv("SHODAN_API_KEY", ""),
        "abuse_ip": os.getenv("ABUSEIP_API_KEY", "")
    })

class GungnirScanner:
    """Scanner principal con capacidades de IA y threat intelligence"""
    
    def __init__(self, config: GungnirConfig):
        self.config = config
        self.nm = nmap.PortScanner()
        self.scan_history = []
        self.active_scans = {}
        
        # Verificar herramientas instaladas
        self._verify_tools()
    
    def _verify_tools(self):
        """Verifica que las herramientas estén instaladas"""
        tools = {
            "nmap": self.config.nmap_path,
            "nuclei": self.config.nuclei_path
        }
        
        self.available_tools = {}
        for tool, path in tools.items():
            try:
                result = subprocess.run([path, "--version"], 
                                      capture_output=True, text=True, timeout=10)
                self.available_tools[tool] = result.returncode == 0
                if self.available_tools[tool]:
                    print(f"✅ {tool} disponible")
                else:
                    print(f"❌ {tool} no encontrado")
            except Exception as e:
                self.available_tools[tool] = False
                print(f"❌ Error verificando {tool}: {e}")
    
    async def execute_nmap_scan(self, target: str, scan_type: str = "aggressive") -> Dict:
        """Ejecuta scan de Nmap real con múltiples perfiles"""
        
        if not self.available_tools.get("nmap", False):
            raise HTTPException(status_code=500, detail="Nmap no está disponible")
        
        scan_profiles = {
            "stealth": "-sS -T2 -f --min-rate 10",
            "aggressive": "-sS -sV -O -A -T4 --min-rate 1000",
            "vulnerability": "-sV --script vuln,exploit -T3",
            "comprehensive": "-sS -sV -sC -O -A -T4 --script vuln,exploit,discovery --min-rate 500",
            "quick": "-sS -T4 --top-ports 1000"
        }
        
        try:
            scan_id = f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            print(f"🎯 Iniciando scan {scan_type} en {target} (ID: {scan_id})")
            
            # Marcar scan como activo
            self.active_scans[scan_id] = {
                "target": target,
                "type": scan_type,
                "status": "running",
                "start_time": datetime.now()
            }
            
            # Ejecutar Nmap
            scan_args = scan_profiles.get(scan_type, scan_profiles["aggressive"])
            
            # Timeout personalizado según el tipo de scan
            timeout_map = {
                "stealth": 600,
                "comprehensive": 900,
                "vulnerability": 450,
                "aggressive": 300,
                "quick": 60
            }
            
            scan_timeout = timeout_map.get(scan_type, 300)
            
            # Realizar el scan
            self.nm.scan(target, arguments=scan_args, timeout=scan_timeout)
            
            # Procesar resultados
            results = {
                "scan_id": scan_id,
                "timestamp": datetime.now().isoformat(),
                "target": target,
                "scan_type": scan_type,
                "duration": (datetime.now() - self.active_scans[scan_id]["start_time"]).total_seconds(),
                "hosts": [],
                "summary": {
                    "total_hosts": 0,
                    "hosts_up": 0,
                    "total_ports": 0,
                    "open_ports": 0,
                    "services_detected": 0
                },
                "raw_output": self.nm.get_nmap_last_output()
            }
            
            # Procesar cada host encontrado
            for host in self.nm.all_hosts():
                host_info = {
                    "ip": host,
                    "hostname": self.nm[host].hostname(),
                    "state": self.nm[host].state(),
                    "ports": [],
                    "os": {"matches": []},
                    "scripts": {},
                    "risk_score": 0
                }
                
                # Detección de OS
                if 'osmatch' in self.nm[host]:
                    for osmatch in self.nm[host]['osmatch']:
                        host_info["os"]["matches"].append({
                            "name": osmatch['name'],
                            "accuracy": int(osmatch['accuracy']),
                            "cpe": osmatch.get('osclass', [{}])[0].get('cpe', [])
                        })
                
                # Procesar puertos y servicios
                total_ports = 0
                open_ports = 0
                
                for protocol in self.nm[host].all_protocols():
                    ports = self.nm[host][protocol].keys()
                    total_ports += len(ports)
                    
                    for port in ports:
                        port_info = self.nm[host][protocol][port]
                        
                        if port_info['state'] == 'open':
                            open_ports += 1
                        
                        port_data = {
                            "port": port,
                            "protocol": protocol,
                            "state": port_info['state'],
                            "service": port_info.get('name', 'unknown'),
                            "version": port_info.get('version', ''),
                            "product": port_info.get('product', ''),
                            "extrainfo": port_info.get('extrainfo', ''),
                            "scripts": {}
                        }
                        
                        # Scripts NSE
                        if 'script' in port_info:
                            for script_name, script_output in port_info['script'].items():
                                port_data["scripts"][script_name] = script_output
                        
                        # Calcular risk score del puerto
                        port_data["risk_score"] = self._calculate_port_risk(port_data)
                        host_info["risk_score"] += port_data["risk_score"]
                        
                        host_info["ports"].append(port_data)
                
                # Scripts a nivel de host
                if 'hostscript' in self.nm[host]:
                    for script in self.nm[host]['hostscript']:
                        host_info["scripts"][script['id']] = script['output']
                
                results["hosts"].append(host_info)
                results["summary"]["services_detected"] += len([p for p in host_info["ports"] if p["service"] != "unknown"])
            
            # Actualizar summary
            results["summary"]["total_hosts"] = len(results["hosts"])
            results["summary"]["hosts_up"] = len([h for h in results["hosts"] if h["state"] == "up"])
            results["summary"]["total_ports"] = sum(len(h["ports"]) for h in results["hosts"])
            results["summary"]["open_ports"] = sum(len([p for p in h["ports"] if p["state"] == "open"]) for h in results["hosts"])
            
            # Marcar scan como completado
            self.active_scans[scan_id]["status"] = "completed"
            self.active_scans[scan_id]["end_time"] = datetime.now()
            
            # Guardar en historial
            self.scan_history.append(results)
            
            return results
            
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=408, detail=f"Scan timeout después de {scan_timeout} segundos")
        except Exception as e:
            if scan_id in self.active_scans:
                self.active_scans[scan_id]["status"] = "failed"
                self.active_scans[scan_id]["error"] = str(e)
            raise HTTPException(status_code=500, detail=f"Error en scan: {str(e)}")
    
    def _calculate_port_risk(self, port_data: Dict) -> int:
        """Calcula el riesgo de un puerto basado en el servicio y scripts"""
        risk = 0
        
        # Servicios de alto riesgo
        high_risk_services = ["ftp", "telnet", "smtp", "snmp", "rpc", "netbios-ssn", "microsoft-ds"]
        medium_risk_services = ["ssh", "http", "https", "pop3", "imap", "ldap"]
        
        service = port_data.get("service", "").lower()
        
        if service in high_risk_services:
            risk += 7
        elif service in medium_risk_services:
            risk += 3
        elif port_data["state"] == "open":
            risk += 1
        
        # Scripts que indican vulnerabilidades
        vuln_keywords = ["vuln", "exploit", "cve", "weak", "default", "anonymous"]
        for script_name, script_output in port_data.get("scripts", {}).items():
            if any(keyword in script_name.lower() or keyword in script_output.lower() 
                   for keyword in vuln_keywords):
                risk += 5
        
        return min(risk, 10)  # Max 10
    
    async def nuclei_vuln_scan(self, target: str) -> Dict:
        """Scan de vulnerabilidades con Nuclei"""
        if not self.available_tools.get("nuclei", False):
            return {"error": "Nuclei no está disponible", "vulnerabilities": []}
        
        try:
            print(f"🔍 Ejecutando Nuclei scan en {target}")
            
            # Comando Nuclei con templates actualizados
            cmd = [
                self.config.nuclei_path,
                "-target", target,
                "-json",
                "-silent",
                "-rate-limit", "50",
                "-timeout", "10",
                "-retries", "2"
            ]
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=180)
            
            vulnerabilities = []
            if stdout:
                for line in stdout.decode().strip().split('\n'):
                    if line:
                        try:
                            vuln = json.loads(line)
                            # Enriquecer datos de vulnerabilidad
                            vuln_data = {
                                "template_id": vuln.get("template-id", "unknown"),
                                "name": vuln.get("info", {}).get("name", "Unknown"),
                                "severity": vuln.get("info", {}).get("severity", "info"),
                                "description": vuln.get("info", {}).get("description", ""),
                                "reference": vuln.get("info", {}).get("reference", []),
                                "tags": vuln.get("info", {}).get("tags", []),
                                "matched_at": vuln.get("matched-at", ""),
                                "timestamp": vuln.get("timestamp", ""),
                                "curl_command": vuln.get("curl-command", "")
                            }
                            vulnerabilities.append(vuln_data)
                        except json.JSONDecodeError:
                            continue
            
            # Clasificar vulnerabilidades por severidad
            severity_count = {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0}
            for vuln in vulnerabilities:
                severity = vuln.get("severity", "info")
                severity_count[severity] = severity_count.get(severity, 0) + 1
            
            return {
                "timestamp": datetime.now().isoformat(),
                "target": target,
                "vulnerabilities": vulnerabilities,
                "total_vulns": len(vulnerabilities),
                "severity_breakdown": severity_count,
                "scan_duration": "N/A"
            }
            
        except asyncio.TimeoutError:
            return {"error": "Nuclei scan timeout", "vulnerabilities": []}
        except Exception as e:
            return {"error": f"Error en Nuclei scan: {str(e)}", "vulnerabilities": []}
    
    async def threat_intel_lookup(self, ip: str) -> Dict:
        """Consulta múltiples fuentes de threat intelligence"""
        intel_data = {
            "ip": ip,
            "reputation": "unknown",
            "risk_score": 0,
            "threat_types": [],
            "sources": [],
            "details": {}
        }
        
        # VirusTotal lookup
        if self.config.threat_intel_apis.get("virustotal"):
            try:
                headers = {"x-apikey": self.config.threat_intel_apis["virustotal"]}
                url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip}"
                
                async with asyncio.timeout(10):
                    response = requests.get(url, headers=headers)
                    if response.status_code == 200:
                        vt_data = response.json()
                        attributes = vt_data.get("data", {}).get("attributes", {})
                        stats = attributes.get("last_analysis_stats", {})
                        
                        malicious = stats.get("malicious", 0)
                        suspicious = stats.get("suspicious", 0)
                        
                        if malicious > 0:
                            intel_data["reputation"] = "malicious"
                            intel_data["risk_score"] += 8
                            intel_data["threat_types"].append("malware")
                        elif suspicious > 0:
                            intel_data["reputation"] = "suspicious"
                            intel_data["risk_score"] += 5
                        else:
                            intel_data["reputation"] = "clean"
                        
                        intel_data["details"]["virustotal"] = {
                            "malicious": malicious,
                            "suspicious": suspicious,
                            "harmless": stats.get("harmless", 0),
                            "undetected": stats.get("undetected", 0)
                        }
                        intel_data["sources"].append("VirusTotal")
                        
            except Exception as e:
                print(f"Error VirusTotal lookup: {e}")
        
        # AbuseIPDB lookup
        if self.config.threat_intel_apis.get("abuse_ip"):
            try:
                headers = {
                    "Key": self.config.threat_intel_apis["abuse_ip"],
                    "Accept": "application/json"
                }
                params = {"ipAddress": ip, "maxAgeInDays": "90", "verbose": ""}
                url = "https://api.abuseipdb.com/api/v2/check"
                
                async with asyncio.timeout(10):
                    response = requests.get(url, headers=headers, params=params)
                    if response.status_code == 200:
                        abuse_data = response.json().get("data", {})
                        
                        abuse_confidence = abuse_data.get("abuseConfidencePercentage", 0)
                        if abuse_confidence > 75:
                            intel_data["reputation"] = "malicious"
                            intel_data["risk_score"] += 7
                        elif abuse_confidence > 25:
                            intel_data["reputation"] = "suspicious"
                            intel_data["risk_score"] += 4
                        
                        intel_data["details"]["abuseipdb"] = {
                            "abuse_confidence": abuse_confidence,
                            "country_code": abuse_data.get("countryCode", ""),
                            "is_whitelisted": abuse_data.get("isWhitelisted", False),
                            "total_reports": abuse_data.get("totalReports", 0)
                        }
                        intel_data["sources"].append("AbuseIPDB")
                        
            except Exception as e:
                print(f"Error AbuseIPDB lookup: {e}")
        
        return intel_data
    
    async def analyze_with_ai(self, scan_results: Dict, analysis_type: str = "comprehensive") -> Dict:
        """Análisis inteligente con IA (simulado por ahora)"""
        try:
            # Por ahora, análisis basado en reglas hasta que configures OpenAI
            hosts = scan_results.get("hosts", [])
            total_risk = 0
            critical_findings = []
            recommendations = []
            
            for host in hosts:
                host_risk = host.get("risk_score", 0)
                total_risk += host_risk
                
                # Servicios críticos
                dangerous_services = []
                for port in host.get("ports", []):
                    if port.get("service") in ["ftp", "telnet", "snmp"] and port.get("state") == "open":
                        dangerous_services.append(f"{port['service']} en puerto {port['port']}")
                
                if dangerous_services:
                    critical_findings.extend(dangerous_services)
            
            # Calcular risk score general
            avg_risk = total_risk / max(len(hosts), 1)
            
            # Generar recomendaciones básicas
            if any("ftp" in finding for finding in critical_findings):
                recommendations.append("Deshabilitar FTP y usar SFTP/SCP")
            if any("telnet" in finding for finding in critical_findings):
                recommendations.append("Reemplazar Telnet con SSH")
            if any("snmp" in finding for finding in critical_findings):
                recommendations.append("Configurar SNMP v3 o deshabilitar")
            
            analysis = {
                "risk_score": min(int(avg_risk), 10),
                "severity": "critical" if avg_risk >= 8 else "high" if avg_risk >= 6 else "medium" if avg_risk >= 3 else "low",
                "critical_findings": critical_findings[:10],  # Top 10
                "recommendations": recommendations,
                "summary": f"Análisis completado para {len(hosts)} hosts. Risk score promedio: {avg_risk:.1f}",
                "attack_vectors": [
                    "Servicios inseguros expuestos",
                    "Posible enumeración de servicios",
                    "Vectores de fuerza bruta"
                ] if critical_findings else ["Perfil de riesgo bajo detectado"],
                "analysis_type": analysis_type,
                "timestamp": datetime.now().isoformat()
            }
            
            return analysis
            
        except Exception as e:
            return {
                "error": f"Error en análisis IA: {str(e)}",
                "risk_score": 5,
                "summary": "Análisis IA no disponible",
                "timestamp": datetime.now().isoformat()
            }

# FastAPI App
app = FastAPI(
    title="Wotanzeroday Gungnir",
    description="Advanced SOC Platform with AI-powered threat analysis",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instancia global del scanner
config = GungnirConfig()
scanner = GungnirScanner(config)

@app.post("/api/scan")
async def execute_scan(request: ScanRequest, background_tasks: BackgroundTasks):
    """Endpoint principal de scanning con análisis completo"""
    
    if not request.target:
        raise HTTPException(status_code=400, detail="Target requerido")
    
    print(f"🎯 Iniciando scan completo: {request.target}")
    
    # Ejecutar scan principal
    results = await scanner.execute_nmap_scan(request.target, request.scan_type)
    
    # Agregar threat intel para cada IP encontrada
    for host in results["hosts"]:
        if host["state"] == "up":
            print(f"🔍 Consultando threat intel para {host['ip']}")
            host["threat_intel"] = await scanner.threat_intel_lookup(host["ip"])
    
    # Scan de vulnerabilidades con Nuclei (si está habilitado)
    if request.include_vulns:
        print("🔍 Ejecutando scan de vulnerabilidades...")
        nuclei_results = await scanner.nuclei_vuln_scan(request.target)
        results["nuclei_scan"] = nuclei_results
    
    # Análisis con IA (si está habilitado)
    if request.ai_analysis:
        print("🤖 Ejecutando análisis IA...")
        ai_analysis = await scanner.analyze_with_ai(results)
        results["ai_analysis"] = ai_analysis
    
    return results

@app.get("/api/scan/history")
async def get_scan_history(limit: int = 10):
    """Obtener historial de scans"""
    return {
        "scans": scanner.scan_history[-limit:],
        "total": len(scanner.scan_history)
    }

@app.get("/api/scan/active")
async def get_active_scans():
    """Obtener scans activos"""
    return {"active_scans": scanner.active_scans}

@app.post("/api/ai/analyze")
async def ai_analyze(request: AIAnalysisRequest):
    """Análisis IA de datos específicos"""
    
    # Crear datos mock para el análisis
    mock_data = {"custom_data": request.data}
    analysis = await scanner.analyze_with_ai(mock_data, request.analysis_type)
    
    return {"analysis": analysis}

@app.get("/api/tools/status")
async def tools_status():
    """Estado de las herramientas del sistema"""
    return {
        "tools": scanner.available_tools,
        "config": {
            "has_openai_key": bool(scanner.config.openai_api_key),
            "has_virustotal_key": bool(scanner.config.threat_intel_apis.get("virustotal")),
            "has_shodan_key": bool(scanner.config.threat_intel_apis.get("shodan"))
        }
    }

@app.get("/api/status")
async def health_check():
    """Health check del sistema"""
    return {
        "status": "operational",
        "version": "2.0.0",
        "capabilities": {
            "nmap": scanner.available_tools.get("nmap", False),
            "nuclei": scanner.available_tools.get("nuclei", False),
            "ai_analysis": True,
            "threat_intel": True
        },
        "active_scans": len(scanner.active_scans),
        "total_scans": len(scanner.scan_history),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "🏹 Wotanzeroday Gungnir API",
        "description": "Advanced SOC Platform - The spear that never misses",
        "version": "2.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("🏹 Iniciando Wotanzeroday Gungnir v2.0.0")
    print("🎯 Scanner inteligente con IA y threat intelligence")
    print("📡 API disponible en: http://localhost:8000")
    print("📚 Documentación en: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
