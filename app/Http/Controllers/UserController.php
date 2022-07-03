<?php

namespace App\Http\Controllers;


use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class UserController extends Controller
{
    


    public function login(Request $request){   
    
      $user = User::where('email', $request->email)->first();
      $inputPassword = $request->password;
      $databesePassword= $user->password;
     
     $checkPassword = Hash::check($request->password, $user->password);
      
        
     if($user && $checkPassword){
       
        return $user; 
    }
    else return ['error' => "Zły email lub hasło."];
   


      
    }


public function newUser(){
      $user = new User; 
      
          $haslo =   Hash::make($request -> password);


        $user -> password = $haslo;

        $user -> save();
        return  " user add";
}

     
    

    public function destroy($id)
    {
        $todo = User::findOrFail($id);
        $todo->delete();
        return User::latest()->get();
    }
}
