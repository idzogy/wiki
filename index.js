const title = sessionStorage.getItem('title') || '대문';
sessionStorage.removeItem('title');
history.replaceState(null, '', `/wiki/${title}`);
document.title = `${title} - 이저그`;

let content = '';
let documents = [];
const resultBox = document.getElementById('result');
const contentBox = document.getElementById('content');
const temp = /\{\{([^{}]+)\}\}/;
const tempVar = /<<([^<>]+)>>/;
let tempVars = {};
const func = /\$\{(.+?)\}/g;

const md = window.markdownit({ html: true })
.use(window.markdownitFootnote)
.use(window.markdownitMultimdTable, { headerless: true, rowspan: true })
.use(markdownitTh)
.use(window.markdownitContainer, 'jump', {
    render: function(tokens, idx){
        const token = tokens[idx];
        if(token.nesting === 1){
            return '<div class="jump">\n';
        }
        else{
            return '</div>\n';
        }
    }
})
.use(window.markdownitContainer, 'example', {
    render: function(tokens, idx){
        const token = tokens[idx];
        if(token.nesting === 1){
            return '<div class="example">\n';
        }
        else{
            return '</div>\n';
        }
    }
})
.use(window.markdownitContainer, 'quote', {
    render: function(tokens, idx){
        const token = tokens[idx];
        if(token.nesting === 1){
            return '<div class="quote">\n';
        }
        else{
            return '</div>\n';
        }
    }
});

let depth = 0;

md.renderer.rules.table_open = function(tokens, idx){
    depth++;
    
    if(depth === 1){
		return '<div class="table-container">\n<table>\n';
	}
    else{
		return '<table>\n';
	}
};

md.renderer.rules.table_close = function(tokens, idx){
    depth--;
    
    if(depth === 0){
		return '</table>\n</div>\n';
	}
    else{
		return '</table>\n';
	}
};

function markdownitTh(md){
    md.core.ruler.after('block', 'th', function(state){
    const tokens = state.tokens;
    
    for(let i = 0; i < tokens.length; i++){
        const token = tokens[i];
        if(token.type === 'inline' && tokens[i - 1]?.type === 'td_open'){
            if(token.content.startsWith('#')){
                tokens[i - 1].tag = 'th';
                tokens[i + 1].tag = 'th';
                token.content = token.content.slice(2);
            }
        }
    }
    });
}

MathJax.Hub.Config({
    tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        processEscapes: true
    }
});

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
        
        const response2 = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/templates/${match}.md`);
        let replacing = await response2.text();
        
        while(tempVar.test(replacing)){
            replacing = replacing.replace(tempVar, (m, p1) => tempVars[p1] || '');
        }
        
        replacing = replacing.replace(func, (m, p1) => {return eval(p1);});
        console.log(`틀(파싱 전): ${replacing}`);
        
        replacing = md.render(replacing);
        console.log(`틀(파싱 후): ${replacing}`);
        
        content = content.replace(temp, replacing);
    }
    
    // functions
    content = content.replace(func, (m, p1) => {return eval(p1);});
    
    content = md.render(content);
    
    // custom
    content = content.replace(/(?<=[^\!])\[\[([^\[\]]+)\]\]/g, `<a href="./$1">$1</a>`);
    content = content.replace(/\!\[\[([^\[\]]+)\]\]/g, `<img src="./imgs/$1">`);
    
    content = `<h1>${title}</h1>` + content;
    contentBox.innerHTML = content;
    
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, contentBox]);
}

async function setDocuments(){
    const response = await fetch(`https://raw.githubusercontent.com/idzogy/wiki/main/assets/tree.json`);
    documents = await response.json();
    documents = documents[0]['contents'].map(doc => doc['name'].slice(0,-3));
}

function search(s){
    resultBox.innerHTML = '';
    documents.filter(row => row.includes(s)).sort((a,b) => sort(a,b,s)).slice(0,8).forEach(docName => {
        resultBox.innerHTML += `<a href="./${docName}" style="color:var(--text);">${docName}</a>`;
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
