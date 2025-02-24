const title = new URL(window.location.href).searchParams.get('title') || '대문';
let content = '';
let documents = [];
const resultBox = document.getElementById('result');
const contentBox = document.getElementById('content');
const temp = /\{\{(틀:[^{}]+)\}\}/;
const tempVar = /<<([^<>]+)>>/;
let tempVars = {};
const func = /\$\{(.+?)\}/g;

async function setContent(){
    const response1 = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${title}.md`);
    content = await response1.text();
    
    // templates
    while(temp.test(content)){
        tempVars = {};
        
        let match = content.match(temp)[1].replaceAll('\n', '');
        
        while(match.includes('|')){
            match = match.replace(/\|([^|=]+)=([^|=]+)/, (m, variable, value) => {tempVars[variable] = value;return '';});
        }
        
        const response2 = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/docs/${match}.md`);
        let replacing = await response2.text();
        
        while(tempVar.test(replacing)){
            replacing = replacing.replace(tempVar, (m, p1) => tempVars[p1] || '');
        }
        
        replacing = replacing.replace(func, (m, p1) => {return new Function(`return ${p1}`)()});
        
        replacing = marked.parse(replacing);
        
        content = content.replace(temp, replacing);
    }
    
    // functions
    content = content.replace(func, (m, p1) => {return new Function(`return ${p1}`)()});
    
    content = marked.parse(content);
    
    // custom
    content = content.replace(/(?<=[^\!])\[\[([^\[\]]+)\]\]/g, `<a href="?title=$1">$1</a>`);
    content = content.replace(/\!\[\[([^\[\]]+)\]\]/g, `<img src="imgs/$1">`);
    
    content = `<h1>${title}</h1>` + content;
    contentBox.innerHTML = content;
}

async function setDocuments(){
    const response = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/assets/tree.json`);
    documents = await response.json();
    documents = documents[0]['contents'].map(doc => doc['name'].slice(0,-3));
}

function search(s){
    resultBox.innerHTML = '';
    documents.filter(row => row.includes(s)).sort((a,b) => sort(a,b,s)).slice(0,8).forEach(docName => {
        resultBox.innerHTML += `<a href="?title=${docName}" style="color:var(--text);">${docName}</a>`;
    });
}

function sort(a,b,s){
    if(a.startsWith(s) && !b.startsWith(s)){
        return -1;
    }
    if(!a.startsWith(s) && b.startsWith(s)){
        return 1;
    }
    if(a.length > b.length){
        return -1;
    }
    if(a.length < b.length){
        return 1;
    }
    return 0;
}

setContent();
setDocuments();