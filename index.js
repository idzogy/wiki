const title = new URL(window.location.href).searchParams.get('title');
let content = '';

const contentBox = document.getElementById('content');

async function getContent(){
  const response = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${title}.md`);
  content = await response.text();
  content = marked.parse(content);
}

function setContent(){
  contentBox.innerHTML = content;
}

getContent();
setContent();
