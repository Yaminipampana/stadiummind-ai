import datetime
import random
import json
from typing import List
from app.schemas.stadium import SimulationZoneSchema, OperationalInsightSchema
from app.services.ai.client import ai_client

class AIInsightsService:
    async def generate_insights(self, zones: List[SimulationZoneSchema]) -> List[OperationalInsightSchema]:
        """
        Analyzes zone telemetry parameters to yield actionable operational insights.
        If GEMINI_API_KEY is available, generates insights using Gemini structured outputs.
        Otherwise, falls back to a rule-based mock model for simulations.
        """
        # Formulate textual data summary for Gemini
        zone_summary = []
        for zone in zones:
            zone_summary.append({
                "name": zone.name,
                "category": zone.category,
                "density": zone.density,
                "people": zone.people
            })
            
        if ai_client.api_key:
            # Structuring instructions for Gemini to return insights
            prompt = f"""
            You are the Head of AI Operations at the FIFA World Cup Stadium.
            Analyze the following stadium zones telemetry data and output operational recommendations.
            Data:
            {json.dumps(zone_summary, indent=2)}
            
            Return a JSON array of insights. Each insight must strictly follow this JSON schema:
            {{
              "id": "unique-id",
              "title": "Short title",
              "recommendation": "Detailed recommendation message",
              "category": "gate" | "volunteer" | "redirection" | "congestion" | "security" | "route",
              "priority": "low" | "medium" | "high" | "critical",
              "confidenceScore": float between 0.0 and 1.0
            }}
            Only output the valid JSON array, do not include markdown blocks or wrappers.
            """
            system_instruction = "You are an expert AI operations coordinator for major sporting tournaments."
            try:
                raw_reply = await ai_client.query_model(prompt, system_instruction)
                # Clean clean response of markdown format blocks if any
                clean_json = raw_reply.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]
                clean_json = clean_json.strip()
                
                parsed_insights = json.loads(clean_json)
                insights = []
                for idx, pi in enumerate(parsed_insights):
                    insights.append(
                        OperationalInsightSchema(
                            id=pi.get("id", f"ai-ins-{idx}"),
                            title=pi.get("title", "Operations Alert"),
                            recommendation=pi.get("recommendation", "Review sector logs."),
                            category=pi.get("category", "congestion"),
                            priority=pi.get("priority", "medium"),
                            confidenceScore=float(pi.get("confidenceScore", 0.85)),
                            timestamp=datetime.datetime.utcnow()
                        )
                    )
                return insights
            except Exception as e:
                # Log error and fallback to mock
                pass

        # Fallback Heuristics Mock AI Logic
        insights = []
        
        # 1. Analyze Gate Densities
        gates = [z for z in zones if z.category == "gate"]
        high_gates = [g for g in gates if g.density > 80]
        if high_gates:
            for hg in high_gates:
                insights.append(
                    OperationalInsightSchema(
                        id=f"gate-{hg.id}",
                        title=f"Open Additional Gates near {hg.name}",
                        recommendation=f"Crowd density at {hg.name} is critical ({hg.density}%). Open overflow turnstiles and deploy staff to route incoming traffic.",
                        category="gate",
                        priority="critical",
                        confidenceScore=0.94,
                        timestamp=datetime.datetime.utcnow()
                    )
                )
        else:
            # Info gate recommendation
            insights.append(
                OperationalInsightSchema(
                    id="gate-flow-normal",
                    title="Gate Flow Operations Balance",
                    recommendation="All gates display nominal throughput. Recommend maintaining current volunteer gate alignments.",
                    category="gate",
                    priority="low",
                    confidenceScore=0.88,
                    timestamp=datetime.datetime.utcnow()
                )
            )

        # 2. Food court congestion analysis
        food_courts = [z for z in zones if z.category == "food"]
        busy_food = [fc for fc in food_courts if fc.density > 70]
        if busy_food:
            for bf in busy_food:
                insights.append(
                    OperationalInsightSchema(
                        id=f"food-{bf.id}",
                        title="Deploy More Volunteers to Food Court Area",
                        recommendation=f"{bf.name} queue density is high ({bf.density}%). Dispatch volunteer marshals to form orderly queues and assist with mobile orders.",
                        category="volunteer",
                        priority="high",
                        confidenceScore=0.91,
                        timestamp=datetime.datetime.utcnow()
                    )
                )

        # 3. Merchandise store security presence
        merch_store = next((z for z in zones if z.category == "store"), None)
        if merch_store and merch_store.density > 75:
            insights.append(
                OperationalInsightSchema(
                    id="store-security",
                    title="Increase Security Presence at Store",
                    recommendation="Merchandise store occupancy exceeds safety threshold (80%). Deploy extra security officers to enforce store entry caps.",
                    category="security",
                    priority="high",
                    confidenceScore=0.89,
                    timestamp=datetime.datetime.utcnow()
                )
            )

        # 4. Main Entrance redirection suggestion
        main_ent = next((z for z in zones if z.category == "entrance" and "Main" in z.name), None)
        vip_ent = next((z for z in zones if z.category == "entrance" and "VIP" in z.name), None)
        if main_ent and main_ent.density > 80:
            alternative_name = vip_ent.name if vip_ent else "alternate gates"
            insights.append(
                OperationalInsightSchema(
                    id="entrance-redirect",
                    title="Redirect Visitors from Main Entrance",
                    recommendation=f"Main Entrance bottleneck detected ({main_ent.density}%). Redirect upcoming ticketholders to use {alternative_name} corridors.",
                    category="redirection",
                    priority="critical",
                    confidenceScore=0.95,
                    timestamp=datetime.datetime.utcnow()
                )
            )

        # 5. Suggest alternate route for parking exits
        parking = next((z for z in zones if z.category == "parking"), None)
        if parking and parking.density > 60:
            insights.append(
                OperationalInsightSchema(
                    id="parking-route",
                    title="Suggest Alternate Routing at Parking Area",
                    recommendation="Parking lanes are congested. Broadcast route adjustments to navigation systems directing drivers to East bypass roads.",
                    category="route",
                    priority="medium",
                    confidenceScore=0.82,
                    timestamp=datetime.datetime.utcnow()
                )
            )

        # 6. Global general check
        if len(insights) < 2:
            insights.append(
                OperationalInsightSchema(
                    id="general-nominal",
                    title="Nominal Congestion Management",
                    recommendation="All concourses report fluid movement. No mandatory structural adjustments required.",
                    category="congestion",
                    priority="low",
                    confidenceScore=0.90,
                    timestamp=datetime.datetime.utcnow()
                )
            )
            
        return insights

ai_insights_service = AIInsightsService()
