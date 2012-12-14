---
---

var img=document.createElement("img"),
    post = document.getElementById('post');

img.setAttribute('src', '{{site.baseurl}}/images/anarchy.png');
img.setAttribute('id', 'bg');
document.body.appendChild(img);
post.parentNode.insertBefore(img, post);
