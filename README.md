# minichat-v2
minichat 2.0

demo: http://incongruous-brindle-dew.glitch.me/<br>
demo2: http://104.192.0.82:81/

# Funny html element things
- (img)url(/img) - display image url
- (b)text(/b) - bold text
- (i)text(/i) - italics

# make a chatbot
This uses JSON.stringify to encode messages into string. Of course, that means JSON.parse decodes the strings to messages. So the client message must be JSON.

## Send
- ["rename",string] - rename client to string
- ["chat",string] - send string
## Receive
- ["username",name] - server assigned a username (also response to rename)
- ["chat","&lt;b&gt;(user)&lt;/b&gt;: (msg)"] - server sends html message
- ["logs",array] - gives array of html strings for logs
- ["users",array] - gives array of strings of usernames
