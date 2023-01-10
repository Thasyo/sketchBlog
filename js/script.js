const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector(".container-total-posts div");
const url = "https://jsonplaceholder.typicode.com/posts";

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
        link.innerText = "Ler";
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
    }

    //método para RESGATAR todos os posts da api e disponibilizar no body do html.
    async getAllPosts() {
        
        const response = await fetch(this.url);
        const data = await response.json();
        console.log(data); //demonstração.

        //adicionando a classe hide ao elemento.
        this.loadingElement.classList.add("hide");

        dataBody(data);
    }
}

const responseRequest = new Requests(loadingElement, postsContainer, url);

responseRequest.getAllPosts();
