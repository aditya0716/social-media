
{
    let likes=$('.likesButton');
    for(let like of likes){
        like.addEventListener('click',function(e){
            e.preventDefault();
            let link=like.getAttribute('href').split('?')[1].split('&');
            let id=link[0].substring(3);
            let type=link[1].substring(5);
            $.ajax({
                type:'get',
                url:`/posts/likes/?id=${id}&type=${type}`,
                success:function(data){
                    console.log(data);
                    let count=like.getAttribute('data-likeCount');
                    console.log(count);
                    if(data.deleted){
                        // like.classList.remove('liked')
                        like.style.color='white';
                        like.innerText=--count;
                        like.setAttribute('data-likeCount',count)
                    }else{
                        // like.classList.add('liked');
                        like.style.color='blue';
                        like.innerText=++count;
                        like.setAttribute('data-likeCount',count)
                    }
                },
                error:function(error){
                    console.log(error.responseText);
                },
            });
        });
    };
    let createPost=function(){
        let newPostForm=$('#feedFormPost');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type:'post',
                url:'/posts',
                data:newPostForm.serialize(),
                success:function(data){
                   let newPost=newPostDom(data.data.post,data.curuser);   
                   $('#feedContainer').prepend(newPost);  
                   newPostForm.value="";
                },
                error:function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    let newPostDom=(p,name)=>{
        return $(`<div class="flex-c">
            <div class="flexr">
                <div><h5>${name}</h5></div>
                <div><small>${ p.createdAt.toString().substring(0,10)}</small></div>
            </div>
            <div class="jumbotron flexr colorStyle">
                    ${p.content}
                    <div>
                        <a class="deletepost" href="/posts/delete/?id=${p._id}"><i class="far fa-trash-alt"></i></a>
                    </div>
            </div>
        </div>
        <a href="/showComments/?id=${p._id}">Show Comments</a>
        <div id="hrlength"></div>`)
    }
    let deleteController=$('.deletepost');
    for(let del of deleteController){
        del.addEventListener('click',(e)=>{
            e.preventDefault();
            let id=del.getAttribute('href').split('?')[1].substring(3);
            console.log(id);
            console.log('deleted');
            $.ajax({
                type:'get',
                url:`/posts/delete/?id=${id}`,
                success:function(data){
                    console.log(data.post);
                    for(let d of data.post)
                    {
                        let newPost=newPostDom(d,d.user.name);
                        $('#feedContainer').prepend(newPost);  
                    }  
                },
                error:(error)=>{
                    console.log(error.responseText);
                }

            })

        });
    }
    let newCommentPost=$('#newCommentController');
    newCommentPost.submit(function(e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/posts/create-comment',
            data:newCommentPost.serialize(),
            success:function(data){
                let newCommentRender=newCommentDom(data.newComment,data.user);
                $('#CommentContainer').prepend(newCommentRender);
            },
            error:function(error){
                console.log(error.responseText);
            }
        })
        
    });
    function newCommentDom(comment,user){
        return $(`<div class="flex-c">
                    <div class="flexr">
                        <div><h5>${user}</h5></div>
                        <div><small>${comment.updatedAt.toString().substring(0,10)}</small></div>
                    </div>
                    <div class="flexr jumbotron colorStyle">
                        ${ comment.content }
                            <div>
                                <a href="/posts/deleteComment/?id=${comment._id}"><i class="far fa-trash-alt"></i></a>
                            </div>
                    </div>
                </div>
                <div id="hrlength"></div>
            `)
    }
    
    createPost();
}
