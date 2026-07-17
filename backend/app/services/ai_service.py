import os
from typing import Optional
from app.core.logging_config import logger
from app.services.ai import ai_client, grounding_manager

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model_name = os.getenv("AI_MODEL_NAME", "gemini-1.5-flash")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY environment variable is missing. Running in simulator mode.")

    async def generate_response(self, user_prompt: str, session_id: str, language: str = "en") -> str:
        """
        Orchestrates RAG (Retrieval-Augmented Generation) query pipelines:
        1. Retrieves telemetry grounding context.
        2. Configures target language system rules.
        3. Invokes the client query model.
        """
        languages_map = {
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "hi": "Hindi",
            "ar": "Arabic",
            "pt": "Portuguese",
        }
        language_name = languages_map.get(language, "English")

        system_instruction = (
            f"You are StadiumMind AI, a helpful operations guide for the FIFA World Cup 2026. "
            f"You MUST write all replies in {language_name}. "
            "Resolve fan inquiries regarding seat locations, gates congestion, accessibility wheelchair assists, "
            "and restrooms queue waiting times using the provided facts. Keep answers concise."
        )

        try:
            # 1. Retrieve RAG facts
            context = grounding_manager.retrieve_context(user_prompt)
            combined_prompt = f"Grounded Context Info:\n{context}\n\nUser Inquire:\n{user_prompt}"

            # 2. Query Client (Gemini API or local mockup)
            if not self.api_key:
                return self._mock_respond(user_prompt, context, language)

            return await ai_client.query_model(
                prompt=combined_prompt,
                system_instruction=system_instruction,
                session_id=session_id
            )
        except Exception as e:
            logger.error(f"Failed to process AI response generation: {e}")
            error_msgs = {
                "en": "I am having trouble connecting to my central brain. Please locate a nearby safety team lead.",
                "es": "Tengo problemas para conectarme con mi cerebro central. Busque a un líder de seguridad cercano.",
                "fr": "J'ai du mal à me connecter à mon cerveau central. Veuillez localiser un responsable de la sécurité à proximité.",
                "hi": "मुझे अपने केंद्रीय मस्तिष्क से जुड़ने में समस्या हो रही है। कृपया किसी नजदीकी सुरक्षा अधिकारी से संपर्क करें।",
                "ar": "أواجه مشكلة في الاتصال بالنظام المركزي. يرجى التوجه لأقرب مسؤول سلامة.",
                "pt": "Estou com problemas para me conectar ao cérebro central. Por favor, procure um voluntário de segurança próximo."
            }
            return error_msgs.get(language, error_msgs["en"])

    def _mock_respond(self, prompt: str, context: str, lang: str) -> str:
        """Rich keyword mockup generator for local simulator operations translated into 6 languages."""
        p = prompt.lower()
        
        # Translation maps for mockup answers
        mock_replies = {
            "en": {
                "grounded": "Grounded Telemetry Active",
                "gate": "Gates 1, 2, and 4 are currently open. Gate 2 has clean traffic flow (under 2m waits). We recommend routing spectators away from Gate 4 which is showing queue congestions.",
                "food": "Concession lines are stable. Hot Dog stand A (Level 1, Sec 104) is clear. Pizza Station B is currently experiencing high demand with wait times extending to 20 minutes.",
                "wheelchair": "All elevator platforms are operational. You can book an accessibility escort direct from Gate 4 using the Accessibility Console. Stretcher points are located near gate entries.",
                "toilet": "Clean restrooms are situated behind Section 108 (Level 1) and Section 224 (Level 2). Restroom queue predictions suggest Level 2 stalls are currently less crowded.",
                "emergency": "Safety Evacuation Procedures: Please exit calmly through your nearest designated gate sign. Assemble at the North Car Park zone.",
                "default": "Welcome to StadiumMind AI! Ask me about gate lines, restroom wait estimates, elevator statuses, or safety exits."
            },
            "es": {
                "grounded": "Telemetría en tiempo real activa",
                "gate": "Las puertas 1, 2 y 4 están abiertas. La puerta 2 tiene flujo libre (espera < 2 min). Recomendamos evitar la puerta 4 por congestión.",
                "food": "Las filas de comida son estables. El puesto de Hot Dogs A (Nivel 1, Sec 104) está despejado. La Pizzería B tiene demoras de hasta 20 minutos.",
                "wheelchair": "Todos los ascensores están operativos. Puede solicitar asistencia de silla de ruedas en el panel de Accesibilidad desde la Puerta 4.",
                "toilet": "Los baños limpios están detrás de la Sección 108 (Nivel 1) y 224 (Nivel 2). La predicción sugiere que el Nivel 2 está menos congestionado.",
                "emergency": "Procedimiento de evacuación: Salga con calma por la puerta más cercana. Reúnase en el Estacionamiento Norte.",
                "default": "¡Bienvenido a StadiumMind AI! Pregúnteme sobre filas de puertas, baños, ascensores o salidas de emergencia."
            },
            "fr": {
                "grounded": "Télémétrie en direct activée",
                "gate": "Les portes 1, 2 et 4 sont ouvertes. La porte 2 a un trafic fluide (moins de 2 min). Évitez la porte 4 qui est très encombrée.",
                "food": "Les files d'attente sont stables. Le stand de Hot-dogs A (Sec 104) est libre. La pizzeria B est saturée (attente de 20 min).",
                "wheelchair": "Tous les ascenseurs fonctionnent. Vous pouvez réserver un accompagnement en fauteuil roulant depuis la porte 4 via l'onglet Accessibilité.",
                "toilet": "Des toilettes propres se trouvent derrière la section 108 (Niveau 1) et section 224 (Niveau 2). Le Niveau 2 est moins fréquenté.",
                "emergency": "Évacuation de sécurité: Sortez calmement par la porte la plus proche. Rassemblez-vous au parking Nord.",
                "default": "Bienvenue sur StadiumMind AI! Posez des questions sur les portes, les toilettes, les ascenseurs ou les sorties de secours."
            },
            "hi": {
                "grounded": "सक्रिय टेलीमेट्री चालू है",
                "gate": "गेट 1, 2 और 4 खुले हैं। गेट 2 पर कम भीड़ है (2 मिनट से कम)। हम गेट 4 से बचने की सलाह देते हैं जहाँ भारी भीड़ है।",
                "food": "भोजन काउंटर स्थिर हैं। हॉट डॉग स्टैंड ए (स्तर 1, सेक 104) खाली है। पिज्जा स्टेशन बी पर 20 मिनट तक का प्रतीक्षा समय है।",
                "wheelchair": "सभी लिफ्ट चालू हैं। आप सुगम्यता कंसोल का उपयोग करके गेट 4 से सीधे सहायता बुक कर सकते हैं।",
                "toilet": "साफ शौचालय सेक्शन 108 (स्तर 1) और सेक्शन 224 (स्तर 2) के पीछे हैं। स्तर 2 पर कम भीड़ होने का अनुमान है।",
                "emergency": "सुरक्षा निकासी प्रक्रिया: कृपया निकटतम गेट से शांतिपूर्वक बाहर निकलें। उत्तर कार पार्क में एकत्र हों।",
                "default": "स्टेडियममाइंड एआई में आपका स्वागत है! मुझसे गेट लाइनों, शौचालय प्रतीक्षा समय, लिफ्ट स्थिति या आपातकालीन निकास के बारे में पूछें।"
            },
            "ar": {
                "grounded": "تم تفعيل التوجيه والتحليل المباشر",
                "gate": "البوابات 1 و 2 و 4 مفتوحة الآن. البوابة 2 خالية من الازدحام (أقل من دقيقتين). ننصح بتفادي البوابة 4 بسبب الطوابير الطويلة.",
                "food": "خطوط الوجبات مستقرة. كشك الهوت دوغ A (المستوى 1) فارغ. محطة البيتزا B تشهد طلباً مرتفعاً مع انتظار يصل إلى 20 دقيقة.",
                "wheelchair": "جميع المصاعد تعمل بشكل كامل. يمكنكم طلب مساعد الكرسي المتحرك مباشرة من البوابة 4 عبر لوحة إمكانية الوصول.",
                "toilet": "دورات المياه النظيفة تقع خلف القسم 108 (المستوى 1) والقسم 224 (المستوى 2). تشير التوقعات إلى أن المستوى 2 أقل ازدحاماً.",
                "emergency": "إجراءات الإخلاء والسلامة: يرجى الخروج بهدوء عبر أقرب بوابة. التجمع في مواقف السيارات الشمالية.",
                "default": "مرحباً بكم في مساعد الملعب الذكي! اسألني عن حالة البوابات، دورات المياه، المصاعد، أو مخارج الطوارئ."
            },
            "pt": {
                "grounded": "Telemetria ativa em tempo real",
                "gate": "Os portões 1, 2 e 4 estão abertos. O portão 2 está fluindo bem (espera < 2 min). Recomendamos evitar o portão 4 devido ao congestionamento.",
                "food": "As filas de alimentação estão estáveis. O quiosque de Cachorro-Quente A (Sec 104) está livre. A Pizzaria B está com esperas de até 20 minutos.",
                "wheelchair": "Todos os elevadores estão operando normalmente. Você pode solicitar um assistente de acessibilidade direto do Portão 4 via painel de Acessibilidade.",
                "toilet": "Banheiros limpos estão localizados atrás do Setor 108 (Nível 1) e Setor 224 (Nível 2). O Nível 2 está atualmente com menos filas.",
                "emergency": "Procedimento de emergência: Saia calmamente pelo portão mais próximo. Reúna-se no estacionamento Norte.",
                "default": "Bem-vindo ao StadiumMind AI! Pergunte-me sobre filas dos portões, banheiros, elevadores ou saídas de emergência."
            }
        }
        
        lang_set = mock_replies.get(lang, mock_replies["en"])
        prefix = f"### {lang_set['grounded']}\n*({context})*\n\n"
        
        if "gate" in p:
            return prefix + lang_set["gate"]
        if "food" in p or "drink" in p or "concession" in p:
            return prefix + lang_set["food"]
        if "wheelchair" in p or "accessibility" in p or "elevator" in p:
            return prefix + lang_set["wheelchair"]
        if "toilet" in p or "restroom" in p:
            return prefix + lang_set["toilet"]
        if "emergency" in p or "sos" in p or "evacuate" in p:
            return prefix + lang_set["emergency"]
            
        return prefix + lang_set["default"]

ai_service = AIService()
export_ai_service = ai_service
