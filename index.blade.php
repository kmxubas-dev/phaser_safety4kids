<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="icon" type="image/x-icon" href="{{ asset('radv_phaser/assets/logo.png') }}">
        
        <!-- Styles -->
        <link rel="stylesheet" href="{{ mix('css/app.css') }}">

        <!-- Scripts -->
        <script src="{{ mix('js/app.js') }}" defer></script>

        <!-- Custom -->
        <link rel="preload" as="font" crossorigin="anonymous" type="font/ttf"
            href="./radv_phaser/dependencies/My Kids Handwritten-Basic.ttf">
        <link rel="preload" as="font" crossorigin="anonymous" type="font/ttf"
            href="./radv_phaser/dependencies/GOODDP.ttf">
        <style>
            @font-face {
                font-family: Font_Main;
                src: url('./radv_phaser/dependencies/My Kids Handwritten-Basic.ttf');
            }
            @font-face {
                font-family: Font_Header;
                src: url('./radv_phaser/dependencies/GOODDP.ttf');
            }
        </style>

        <title>Safety4Kids</title>
    </head>
    <body>
        <div class="phaser-game"></div>
        <script src="./radv_phaser/dependencies/phaser.min.js"></script>
        <script type="module" src="./radv_phaser/scripts/main.js"></script>
    </body>
</html>