//elementos da página index.html
const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector(".container-total-posts div");
const url = "https://jsonplaceholder.typicode.com/posts";

//elementos da página post.html
const post = document.querySelector("#post");
const postContainer = document.querySelector(".post-container div");
const commentsContainer = document.querySelector(".comments-container");

//elementos do form para adicionar comentários ao post.
const commentForm = document.querySelector("#comment-form");
const inputEmail = document.querySelector("#email");
const textAreaBody = document.querySelector("#body");
const btnForm = document.querySelector("#btn-form");

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
        this.commentsContainer = commentsContainer;
        this.inputEmail = inputEmail;
        this.textAreaBody = textAreaBody;
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

        //Adicionando os comentários do post selecionado.
        dataComment.map((comment) => {
            
            const commentEmail = comment.email;
            const commentBody = comment.body;

            const email = document.createElement("h3");
            const body = document.createElement("p");

            email.innerText = commentEmail;
            body.innerText = commentBody;

            this.commentsContainer.appendChild(email);
            this.commentsContainer.appendChild(body);

        })
    }

    async postNewComment(id){

        let comment = {
            email: this.inputEmail.value,
            body: this.textAreaBody.value
        }

        comment = JSON.stringify(comment);

        const response = await fetch(`${this.url}/${id}/comments`, {
            method: 'POST',
            body: comment,
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            }
        });

        const data = await response.json();

        const email = document.createElement("h3");
        const body = document.createElement("p");

        email.innerText = data.email;
        body.innerText = data.body;

        this.commentsContainer.appendChild(email);
        this.commentsContainer.appendChild(body);
                
    }


}

const responseRequest = new Requests(loadingElement, postsContainer, url, post, postContainer, commentsContainer, inputEmail, textAreaBody);

if(!postId){
    responseRequest.getAllPosts();
}else{
    responseRequest.getIndividualPost(postId);

    //adicionar comentários ao blog.
    btnForm.addEventListener("click", (e) => {

        e.preventDefault();
        responseRequest.postNewComment(postId);

    })
}
