
var articleListData = [];

$(document).ready(function() {
    $('#articlelist table tbody').on('click', 'td a.deletearticle', deleteArticle);

    populateTable();
});

function populateTable() {

    var tableContent = '';

    $.getJSON( '/article', function(data) {

        articleListData = data;

        $.each(data, function() {
            var article_title = null
            if (this.story_title != null)
                article_title = this.story_title
            else if (this.title != null)
                article_title = this.title

            var article_url = null
            if (this.story_url != null)
                article_url = this.story_url
            else if (this.url != null)
                article_url = this.url

            if (article_title != null) {
                tableContent += '<tr>';
                tableContent += '<td><a href="' + article_url + '" target="_blank" class="articletitle" >' + article_title + '</a></td>';
                tableContent += '<td><a href="#" class="deletearticle" rel="' + this._id + '">delete</a></td>';
                tableContent += '</tr>';
            }
        });

        $('#articlelist table tbody').html(tableContent);
    });
};

function deleteArticle(event) {
    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this article?');
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/article/' + $(this).attr('rel')
        }).done(function( response ) {
            if (response.msg === '') {
            } else {
                alert('Error: ' + response.msg);
            }
            populateTable();
        });
    } else {
        return false;
    }
};
