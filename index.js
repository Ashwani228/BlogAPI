document.querySelectorAll('.delete-form').forEach((form) => {
    form.addEventListener('submit', function(event) {
      if (!confirm('Are you sure you want to delete this post?')) {
        event.preventDefault();
      }
    });
  });
  