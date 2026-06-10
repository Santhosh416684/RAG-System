import requests
from config import OLLAMA_URL, OLLAMA_MODEL


def generate(prompt: str, stream: bool = False) -> str:
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": stream
            },
            timeout=300 # Mistral can take up to 2 min on CPU
        )
        response.raise_for_status()
        return response.json()["response"]
    except requests.exceptions.ConnectionError:
        raise RuntimeError(
            "Ollama is not running. Start it with: ollama serve"
        )
    except requests.exceptions.Timeout:
        raise RuntimeError(
            "Ollama timed out. Try a shorter query or restart Ollama."
        )