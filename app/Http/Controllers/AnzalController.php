<?php

namespace App\Http\Controllers;

use App\Models\Anzal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Response;


class AnzalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    
        $data= Anzal::all();
        
        return $data;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
       
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * 
     */
    public function store(Request $request)
    {
    
  
    
      $this->validate($request,
      [
          'email' => 'required|regex:/(.+)@(.+)\.(.+)/i',
          'message' => 'required',
          'antyspam' => 'required|max:2|regex:/10/',
         

      ],
      [
          'email.required' => 'Podaj swój adres e-mail.',
          'email.regex' => 'Podaj poprawny adres e-mail',
          'message.required' => "Wpisz swoją wiadomość.",
          'antyspam.required' => 'Podaj poprawny wynik.',
          'antyspam.regex' => 'Podaj poprawny wynik.',
          'antyspam.max' => 'Podaj poprawny wynik',
      ]
      );
    


       $fileMimes = array('jpg', 'jpeg', 'png', 'pdf', 'gif', 'doc', 'docx', 'stp', 'DXF');
       $files = $request->file('files');

      
       $maxFilesSize = 0;

        if ($request->hasfile('files')) {
    
        foreach ($files as $file) {
         
           $extension = $file->getClientOriginalExtension();
          
         
        $fileSize = $file -> getSize();
        $maxFilesSize = $maxFilesSize + $fileSize;
     
        }
         if(!in_array($extension, $fileMimes)){
            return response()->json(array(
              'success' => false,
              'error' => "Możesz załączyć pliki o typach: 'jpg', 'jpeg', 'png', 'pdf', 'gif', 'doc', 'docx', 'stp', 'DXF'")
              , 422);
           }

         if($maxFilesSize < 10000000 ){
          foreach ($files as $file) {
            $file ->storeAs('files', $file->getClientOriginalName());
          }
         }
          else{
            return response()->json(array(
              'success' => false,
              'error' => "Za duży rozmiar plików")
              , 422);
          }
             



         
       }


       
         $data = new Anzal();
         $data -> email =$request->email;
         $data -> message = $request->message;
        $data->fileNames= $request ->fileNames;
        $data -> save();
        
       
        return response()->json($data);


    
  }
    
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Anzal  $anzal
     * @return \Illuminate\Http\Response
     */
    public function show(Anzal $anzal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Anzal  $anzal
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $data = Anzal::find($id);
        return $data;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Anzal  $anzal
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Anzal $anzal)
    {
        $data = Anzal::find($id);
    $data ->email = $request('email');
    $data -> message = $request('message');
    $data ->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Anzal  $anzal
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)

    {
      $data = Anzal::findOrFail($id);
 
     
     $filesNameArray = explode(',' , $data -> fileNames);
      if($data -> fileNames){
       
        foreach ( $filesNameArray as $file) {
        
          Storage::delete('files/'.$file);
        }
       
      }

        $data -> delete();
     return Anzal::latest()->get();
       
    }


    public function deleteFiles(Request $request, $id)
    {
      
      return ('files/'.$id);
      Storage::delete('files/'+ $id);
      
    
    }
   
   
   
    public function upload(Request $req)
    {
      $files = $req->file('file');

      if ($req->hasFile('file')) {
        
        foreach ($files as $file) {
      $file ->store('files');
      
        }
        

  }
}

public function download($filename){
 $path = storage_path()."/app/files/".$filename;
 
 
 $content = file_get_contents($path);

 return response($content) ->withHeaders([
  'Content-Type' => mime_content_type($path)
 ]);



 
}
}
