const articles = () => {
    $.getJSON("/articles", (data) => {
        console.log(data);
        let total = 5;
        $("#scrape").empty();
        for (i=0; i < total; i++) {
            let pid = data[i]._id;
            let title = data[i].title;
            let link = data[i].link;
            let article = $('<div class="card">');
            let titleelement = $('<div class="card-heder" id="title">');
            let button = $('<button id="save-article">save article</button>');
            let linkElement = $('<div class="card-body" id="link">');
 
            titleelement.text(title);
            button.attr("data-id", pid);
            titleelement.append(button);
            article.append(titleelement);
 
            linkElement.text(link);
            article.append(linkElement);
 
            $("#scrape").append(article);
 
        };
    });
 };
 
 const scrape = () => {
    $.getJSON("/scrape", (response)=> {
        articles();
    });
 }
 
 $("#mongo").on("click", () => {
    scrape();
    $("#show").hide();
    $("#scrape").show();
 });
 
 $("#new-article").on("click", () => {
    scrape();
    $("#show").hide();
    $("#scrape").show();
 
 })
 
 $("#clear").on("click", () => {
    $("#scrape").empty();
    $.ajax({
        type: "get",
        dataType: "json",
        url: "/clearall",
        success: (response) => {
            $("#scrape").empty();
            $("#show").show();
        }
    });
 });