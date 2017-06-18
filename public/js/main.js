$(document).ready(function() {
    $(".delete-article").on("click", function(e) {
        $target = $(e.target);
        const id = $target.attr("data-id");
        $.ajax({
            type: "DELETE",
            url: "/articles/" + id,
            success: function(response) {
                alert("Mažu úkol");
                window.location.href="/";
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    
});

function showUserId() {
        var pokus = document.getElementById("pokus");
        var select = document.getElementById("select");
        var worker = document.getElementById("worker");
        worker.value = select[select.selectedIndex].value;
        console.log(select[select.selectedIndex].value);
        pokus.appendChild(worker);
    }