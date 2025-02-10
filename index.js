const title = new URL(window.location.href).searchParams.get('title');
let content = '';

const contentBox = document.getElementById('content');

async function getContent(){
  const response = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${title}.md`);
  content = await response.text();
  content = `<h1>${title}</h1>` + marked.parse(content);
  contentBox.innerHTML = content;
}

setContent();
