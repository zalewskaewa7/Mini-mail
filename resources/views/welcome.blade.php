<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Security-Policy" content="default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src * data: blob: android-webview-video-poster:; style-src * 'unsafe-inline';">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="author" content="Ewa Zalewska-Pudło" />
        <meta name="Description" content="Mini mail" />
            <meta name="Keywords" content="Mail" />
            <meta name="csrf-token" content="{{ csrf_token() }}">
           

            <title>Minipoczta</title>

       
       <link href="https://fonts.googleapis.com/css2?family=Shojumaru&display=swap" rel="stylesheet">
       <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
       <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet">
                     <link href="https://fonts.googleapis.com/css2?family=Akronim&display=swap" rel="stylesheet">
                          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet">
                         
       
    </head>
    <body>
        
        <div id="app"></div>
        <script src="/js/app.js"></script>
        
    </body>
</html>
