const title = new URL(window.location.href).searchParams.get('title');
let content = '';

const contentBox = document.getElementByID('content');

async function getContent(){
  const response = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/저언어.md`);
  content = await marked.parse(response.text());
}

function setContent(){
  contentBox.innerHTML = content;
}

getContent();
setContent();
