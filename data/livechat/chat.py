from flask import Flask, request, jsonify
import chat_replay_downloader as ytlive

# $env:FLASK_APP = "chat.py"
# $env:FLASK_ENV=development
# $env:FLASK_DEBUG=1
# python -m flask run

app = Flask(__name__)


@app.route("/chat")
def main():
    data = request.get_json()
    url = str(data.get("url", None))
    start = int(data.get("start_time", 0))
    interval = int(data.get("interval", 20))
    end = start + interval
    attrs = data.get("attrs", ["timestamp", "author", "message"])
    if "timestamp" not in attrs:
        attrs.append("timestamp")
    attrs = [str(attr) for attr in attrs]

    msgs = ytlive.get_chat_replay(
        url,
        start_time=start,
        end_time=end,
        message_type="all",
    )

    if any(msgs):
        keys = msgs[0].keys()
        messages = [{key: msg[key] for key in attrs if key in keys} for msg in msgs]
        rev_messages = sorted(messages, key=lambda d: d["timestamp"], reverse=True)
        return jsonify(rev_messages)
    return {}