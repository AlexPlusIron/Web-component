class CommentComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
        <template id="comment-template">
          <style>
            /* Стили для веб-компонента */
            .comment {
              border: 1px solid #ccc;
              padding: 10px;
              margin: 10px;
            }
  
            button {
              border: none;
              border-radius: 5px;
              padding: 10px 20px;
              background-color: #ccc;
              cursor: pointer;
              margin-right: 10px;
            }
          </style>
          <div class="comment">
            <input id="commentInput" type="text">
            <button id="addCommentButton" class="button">Добавить комментарий</button>
            <div id="comments"></div>
          </div>
        </template>
      `;
  
      const template = this.shadowRoot.getElementById('comment-template');
      const templateContent = template.content;
  
      this.shadowRoot.appendChild(templateContent.cloneNode(true));
  
      this.shadowRoot.getElementById('addCommentButton').addEventListener('click', () => {
        this.addComment();
      });
    }

    addComment() {
        const commentInput = this.shadowRoot.getElementById('commentInput');
        const commentText = commentInput.value;
        if (commentText) {
            const commentDiv = document.createElement('div');
            commentDiv.innerHTML = `
                <div class="comment">
                    <p>${commentText}</p>
                    <button data-likes="0" class="likeButton">Like</button>
                    <button class="replyButton">Reply</button>
                    <button class="deleteButton">Delete</button>
                    <div class="replies"></div>
                </div>
            `;
            this.shadowRoot.getElementById('comments').appendChild(commentDiv);
            commentInput.value = '';

            commentDiv.querySelector('.likeButton').addEventListener('click', () => {
                this.likeComment(commentDiv);
            });
            commentDiv.querySelector('.replyButton').addEventListener('click', () => {
                this.replyToComment(commentDiv);
            });
            commentDiv.querySelector('.deleteButton').addEventListener('click', () => {
                this.deleteComment(commentDiv);
            });
        }
    }

    likeComment(commentDiv) {
        let likeButton = commentDiv.querySelector('.likeButton');
        let likeCount = likeButton.dataset.likes || 0;
        likeCount++;
        likeButton.innerText = `Like (${likeCount})`;
        likeButton.dataset.likes = likeCount;
    }

    replyToComment(commentDiv) {
        if (!commentDiv.querySelector('.replyInput')) {
            const replyInput = document.createElement('input');
            replyInput.className = 'replyInput';
            const replyButton = document.createElement('button');
            replyButton.innerText = 'Add reply';
            replyButton.onclick = () => {
                const replyText = replyInput.value;
                if (replyText) {
                    const replyDiv = document.createElement('div');
                    replyDiv.innerHTML = `
                        <div class="comment" style="margin-left: 20px;">
                            <p>${replyText}</p>
                            <button data-likes="0" class="likeButton">Like</button>
                            <button class="replyButton">Reply</button>
                            <button class="deleteButton">Delete</button>
                            <div class="replies"></div>
                        </div>
                    `;
                    replyDiv.querySelector('.likeButton').addEventListener('click', () => {
                        this.likeComment(replyDiv);
                    });
                    replyDiv.querySelector('.replyButton').addEventListener('click', () => {
                        this.replyToComment(replyDiv);
                    });
                    replyDiv.querySelector('.deleteButton').addEventListener('click', () => {
                        this.deleteComment(replyDiv);
                    });
                    commentDiv.querySelector('.replies').appendChild(replyDiv);
                    replyInput.remove();
                    replyButton.remove();
                }
            };
            commentDiv.appendChild(replyInput);
            commentDiv.appendChild(replyButton);
            replyInput.focus();
        }
    }

    deleteComment(commentDiv) {
        commentDiv.remove();
    }
}

customElements.define('comment-component', CommentComponent);
