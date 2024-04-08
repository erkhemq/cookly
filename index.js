document.addEventListener('DOMContentLoaded', function() {
  var lis = document.querySelectorAll('.type-bottom li');
  lis.forEach(function(li) {
    li.addEventListener('click', function() {
      if (this.style.backgroundColor != '#93C759')
        this.style.backgroundColor = '#93C759';
      else this.style.backgroundColor = 'red';
    });
  });
});