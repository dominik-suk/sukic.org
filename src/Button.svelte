<script>
    let darkmode = false
    function toggle() {
        darkmode = !darkmode
        window.document.body.classList.toggle('dark-mode')
        if (darkmode) {
            document.getElementById("logo").src="images/logo_darkmode.png";
        } else {
            document.getElementById("logo").src="images/logo.png";
        }
    }

    </script>

    <button class="custom-btn btn-3" on:click={toggle}><span><slot/></span></button>
    
    <style>
        .custom-btn {
            width: 130px;
            height: 40px;
            color: #fff;
            border-radius: 100px;
            padding: 10px 25px;
            font-family: 'Lato', sans-serif;
            font-weight: bold;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            display: inline-block;
            outline: none;
        }

        :global(body.dark-mode) button {
            background: rgb(255, 255, 255);
            background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(213, 205, 255) 100%);
            color: #161611;
	    }
        .btn-3 {
            background: rgb(2, 38, 53);
            background: linear-gradient(0deg, rgb(2, 42, 58) 0%, rgb(1, 12, 22) 100%);
            width: 130px;
            height: 40px;
            line-height: 42px;
            padding: 0;
            border: none;
        }

        .btn-3 span {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }
        
        .btn-3:before,
        .btn-3:after {
            position: absolute;
            content: "";
            right: 0;
            top: 0;
            background: rgba(2,126,251,1);
            transition: all 0.3s ease;
        }

        .btn-3:before {
            height: 0%;
            width: 2px;
        }

        .btn-3:after {
            width: 0%;
            height: 2px;
        }

        .btn-3:hover{
            background: transparent;
            box-shadow: none;
        }

        .btn-3:hover:before {
            height: 100%;
        }

        .btn-3:hover:after {
            width: 100%;
        }

        .btn-3 span:hover{
            color: rgba(2,126,251,1);
        }

        .btn-3 span:before,
        .btn-3 span:after {
            position: absolute;
            content: "";
            left: 0;
            bottom: 0;
            background: rgba(2,126,251,1);
            transition: all 0.3s ease;
        }

        .btn-3 span:before {
            width: 2px;
            height: 0%;
        }

        .btn-3 span:after {
            width: 0%;
            height: 2px;
        }

        .btn-3 span:hover:before {
            height: 100%;
        }

        .btn-3 span:hover:after {
            width: 100%;
        }
    </style>