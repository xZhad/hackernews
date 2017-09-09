
var articleListData = [];

$(document).ready(function() {
    $('#articlelist table tbody').on('click', 'tr.openarticle', openArticle);
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
                tableContent += '<tr class="openarticle" rel="' + article_url + '">';
                tableContent += '<td><span class="article-title">' + article_title + '</span><span class="article-author"> - ' + this.author + ' - </span></td>';
                tableContent += '<td><span class="article-date">' + formatTime(this.created_at) + '</span></td>';
                tableContent += '<td><a href="#" class="deletearticle" rel="' + this._id + '"><i class="fa fa-trash-o fa-2x"></i></a></td>';
                tableContent += '</tr>';
            }
        });

        $('#articlelist table tbody').html(tableContent);
    });
};

function formatTime(date){
    if (!moment.isMoment(date)) {
        date = moment(date);
    }

    if (date.isSame(moment(), 'day')) {
        return date.format('hh:mm a');
    } else if (date.isSame(moment().subtract(1, 'd'), 'day')) {
        return 'Yesterday';
    } else {
        return date.format('MMM D');
    }
}

function openArticle(event) {
    event.preventDefault();
    if (event.target.tagName != 'I') {
        window.open($(this).attr('rel'));
    }
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
