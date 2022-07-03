<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MailController;
use App\Http\Controllers\UserController;




header('Access-Control-Allow-Origin: http://127.0.0.1:8000');
//Access-Control-Allow-Origin: *
header('Access-Control-Allow-Methods:  POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers:  Content-Type, X-Auth-Token, Origin, Authorization');

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/




Route::get('/mail', [MailController::class, 'index']);

 Route::post('/mail', [MailController::class, 'store']);

Route::post('/delete/{id}', [MailController::class, 'destroy']);
Route::post('/deleteFiles/{id}', [MailController::class, 'deleteFiles']);

Route::post("/upload", [MailController::class, 'upload']);
Route::get('/download/{filename}', [MailController::class, 'download']);

 Route::post('/login', [UserController::class,'login']); 
 Route::post('/newuser', [UserController::class,'newUser']); 







