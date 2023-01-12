//elementos da página index.html
const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector(".container-total-posts div");
const url = "https://jsonplaceholder.typicode.com/posts";

//elemetos da página post.html
const post = document.querySelector("#post");
const postContainer = document.querySelector(".post-container div");
const commentsContainer = document.querySelector(".comments-container");

//pegando ID de cada post individualmente quando entrar na página post.html
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

//Colocando dados resgatados no body do html.
const dataBody = async (data) => {
    data.map((post) => {

        //criando os elementos que irão resgatar os dados da api.
        const div = document.createElement("div"); 
        const titlePost = document.createElement("h2");
        const bodyPost = document.createElement("p");
        const link = document.createElement("a");

        //inserindo os dados da api nos elementos.
        titlePost.innerText = post.title;
        bodyPost.innerText = post.body;
        link.innerText = "Ver comentários";
        link.setAttribute(`href`, `/post.html?id=${post.id}`);

        //adicionando os elementos com os dados ao body da página.
        div.appendChild(titlePost);
        div.appendChild(bodyPost);
        div.appendChild(link);
        postsContainer.appendChild(div);

         //removendo classe para disponibilizar os dados no body do html.
        postsContainer.classList.remove("hide");
    });
}

class Requests {
    constructor(loadingElement, postsContainer, url){
        this.loadingElement = loadingElement;
        this.postsContainer = postsContainer;
        this.url = url;
        this.post = post;
        this.postContainer = postContainer;
    }

    //método para RESGATAR (requisição GET)todos os posts da api e disponibilizar no body do html.
    async getAllPosts() {
        
        const response = await fetch(this.url);
        const data = await response.json();

        //adicionando a classe hide ao elemento.
        this.loadingElement.classList.add("hide");

        dataBody(data);
    }

    async getIndividualPost(id){

        //fazendo das requisições GET ao mesmo tempo.
        const [responsePost, responseComment] = await Promise.all([
            fetch(`${this.url}/${id}`),
            fetch(`${this.url}/${id}/comments`)
        ]);

        const dataPost = await responsePost.json();
        const dataComment = await responseComment.json();

        this.loadingElement.classList.add("hide");
        this.post.removeAttribute("class");

        //Adicionando post individual à segunda página a partir do link.
        const titleIndividualPost = document.createElement("h1");
        const bodyIndividualPost = document.createElement("p");

        titleIndividualPost.innerText = dataPost.title;
        bodyIndividualPost.innerText = dataPost.body;

        const div = document.createElement("div");

        div.appendChild(titleIndividualPost);
        div.appendChild(bodyIndividualPost);

        this.postContainer.appendChild(div);

    }
}

const responseRequest = new Requests(loadingElement, postsContainer, url, post, postContainer);

if(!postId){
    responseRequest.getAllPosts();
}else{
    responseRequest.getIndividualPost(postId);
}
