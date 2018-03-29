from flask import Flask, request, redirect, render_template

app = Flask(__name__)


@app.route('/')
def main_chick():
    return render_template('index.html')


@app.route('/', methods=['POST'])
def side_chick():
    if request.method == 'POST':
        Text = request.form['text']
        processed_text = Text.lower()
        print (processed_text)
        return redirect("/", code=302)
    else:
        print('nope')
        return redirect("/", code=302)




if __name__ == "__main__":
    app.run(debug=True)
