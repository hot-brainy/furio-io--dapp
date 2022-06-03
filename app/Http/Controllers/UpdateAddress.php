<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UpdateAddress extends Controller
{
    /**
     * Invoke.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'address' => 'required',
            'name' => 'nullable|max:255',
        ]);
        $address = Address::firstOrNew([
            'address' => $request->get('address'),
        ]);
        $address->nonce = 'FURIO-MESSAGE-VALIDATION-' . Str::random(8);
        $address->save();
        if (Auth::user() && $name = $request->get('name')) {
            $address->name = $name;
        }

        return response()->json([
            'nonce' => $address->nonce,
            'name' => $address->name,
        ]);
    }
}
