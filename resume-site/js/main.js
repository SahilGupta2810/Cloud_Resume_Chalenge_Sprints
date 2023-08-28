class MyNavigation extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
        <nav class="navbar navbar-expand-lg navbar-light bg-white py-3">
                <div class="container px-5">
                    <a class="navbar-brand" href=""><span class="fw-bolder text-primary">Visitor: </span></a>
                    <h1 style="display: inline-block" id="data"></h1>
                    <script src="script.js"></script>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
                            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                            <li class="nav-item"><a class="nav-link" href="resume.html">Resume</a></li>
                            <li class="nav-item"><a class="nav-link" href="certification.html">Certification</a></li>
                            <li class="nav-item"><a class="nav-link" href="projects.html">Projects</a></li>
                            <li class="nav-item"><a class="nav-link" href="https://medium.com/@sahilg98" target="_blank">Blogs</a></li>
                            <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            `
    }
}

customElements.define('my-navigation', MyNavigation)

class MyHead extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content />
                <meta name="author" content />
                <title>Personal Portfolio</title>
                <!-- Favicon-->
                <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
                <!-- Custom Google font-->
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@100;200;300;400;500;600;700;800;900&amp;display=swap"
                    rel="stylesheet" />
                <!-- Bootstrap icons-->
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" rel="stylesheet" />
                <!-- Core theme CSS (includes Bootstrap)-->
                <link href="css/styles.css" rel="stylesheet" />
            </head>
    `
    }
}

customElements.define('my-head', MyHead)