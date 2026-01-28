import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from summary_service import generate_match_summary
from summary_service import gen_match_summary_v2

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/api/summary", methods=["POST"])
def summary():
    data = request.get_json()

    if not data or "youtubeUrl" not in data:
        return jsonify({"error": "youtubeUrl is required"}), 400

    youtube_url = data["youtubeUrl"]
    print(f"Generating summary for: {youtube_url}")

    try:
        # summary_text = generate_match_summary(youtube_url)
        summary_text = gen_match_summary_v2(youtube_url)
        return jsonify({"summary": summary_text})
    except Exception as e:
        print(f"Error generating summary: {e}")
        return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3001))
    print(f"Summary service running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
