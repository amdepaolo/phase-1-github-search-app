document.addEventListener('DOMContentLoaded', ()=>{
    const searchBar = document.querySelector('#github-form');
    searchBar.addEventListener('submit', e=>{
        e.preventDefault();
        console.log(document.getElementById('search-type').value)
        searchFunction();
        
    });
});

function searchFunction(){
    let items = document.querySelector("#search").value;
    let searchType = document.getElementById('search-type').value;
    if (searchType === 'users'){
        fetch(
            `https://api.github.com/search/users?q=${items}`,
            {headers:{
                Accept: 'application/vnd.github.v3+json'}}
        )
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp);
            let userList = document.querySelector('#user-list');
            userList.innerHTML ='';
            resp.items.map(displayResults)
        })
        .catch(err => console.log(err));   
    }
    else if (searchType === 'repos'){
        fetch(
            `https://api.github.com/search/repositories?q=${items}`,
            {headers:{
                Accept: 'application/vnd.github.v3+json'}}
        )
        .then(resp => resp.json())
        .then(resp => {
            const repoList = document.querySelector('#repos-list')
            repoList.innerHTML = ''
            resp.items.map(repoBuilder);
        });
    };  
};

function displayResults(userObject){
    let userList = document.querySelector('#user-list');
    let userName = document.createElement('h2');
    userName.textContent = userObject.login;
    userName.addEventListener('click', repoLister);
    let avatarImg = document.createElement('img');
    avatarImg.src = userObject.avatar_url;
    let profileLink = document.createElement('a');
    profileLink.href = userObject.html_url;
    profileLink.innerText = 'Profile';
    let li = document.createElement('li');
    li.append(userName, avatarImg, profileLink);
    userList.appendChild(li);
};

function repoLister(event){
    userForRepos = event.target.innerText
    console.log(userForRepos)
    fetch(`https://api.github.com/users/${userForRepos}/repos`, 
        {headers:{
            Accept: 'application/vnd.github.v3+json'}})
    .then(resp => resp.json())
    .then(resp => {
        const repoList = document.querySelector('#repos-list')
        repoList.innerHTML = ''
        resp.map(repoBuilder)
    })
};

function repoBuilder(repo){
    const repoList = document.querySelector('#repos-list')
    let repoLink = document.createElement('a');
    repoLink.href = repo.html_url;
    repoLink.innerText = repo.name;
    let li = document.createElement('li');
    li.append(repoLink);
    repoList.append(li);
};