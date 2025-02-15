const title = new URL(window.location.href).searchParams.get('title');
let content = '';

const contentBox = document.getElementById('content');

async function setContent(){
    content = await getContent(title);
    content = await readTemplates(content);
    content = marked.parse(content);
    content = content.replace(/(?<=[^\!])\[\[([^\[\]]+)\]\]/g, `<a href="?title=$1">$1</a>`);
    content = content.replace(/\!\[\[([^\[\]]+)\]\]/g, `<img src="imgs/$1">`);
    content = `<h1>${title}</h1>` + content;
    contentBox.innerHTML = content;
}

async function getContent(str){
    const response = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${str}.md`);
    return await response.text();
}


async function readTemplates(str) {
    const matches = [...str.matchAll(/\{\{(틀:[^{}]+)\}\}/g)];
    
    if (matches.length === 0) {
        return str;
    }

    const replacements = await Promise.all(
        matches.map(async match => ({
            original: match[0],
            content: await getContent(match[1])
        }))
    );

    return replacements.reduce(
        (text, {original, content}) => text.replace(original, content),
        str
    );
}

setContent();