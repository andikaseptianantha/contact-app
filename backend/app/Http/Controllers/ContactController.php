<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $contacts = $request->user()
            ->contacts()
            ->with('phones')
            ->get();

        return response()->json([
            'data' => $contacts
        ]);
    }
}