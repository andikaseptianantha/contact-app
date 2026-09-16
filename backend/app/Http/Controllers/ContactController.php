<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    // GET /api/contacts
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

    // POST /api/contacts
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'phones' => 'required|array|min:1',
            'phones.*' => 'required|string|max:20',
        ]);

        $contact = DB::transaction(function () use ($request, $validated) {

            $contact = $request->user()->contacts()->create([
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'address' => $validated['address'] ?? null,
            ]);

            foreach ($validated['phones'] as $phone) {
                $contact->phones()->create([
                    'phone' => $phone
                ]);
            }

            return $contact;
        });

        $contact->load('phones');

        return response()->json([
            'message' => 'Kontak berhasil ditambahkan',
            'data' => $contact
        ], 201);
    }

    // GET /api/contacts/{id}
    public function show(Request $request, $id)
    {
        $contact = $request->user()
            ->contacts()
            ->with('phones')
            ->find($id);

        if (!$contact) {
            return response()->json([
                'message' => 'Kontak tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'data' => $contact
        ]);
    }

    // PUT /api/contacts/{id}
    public function update(Request $request, $id)
    {
        $contact = $request->user()
            ->contacts()
            ->find($id);

        if (!$contact) {
            return response()->json([
                'message' => 'Kontak tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'phones' => 'required|array|min:1',
            'phones.*' => 'required|string|max:20',
        ]);

        DB::transaction(function () use ($contact, $validated) {

            $contact->update([
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'address' => $validated['address'] ?? null,
            ]);

            $contact->phones()->delete();

            foreach ($validated['phones'] as $phone) {
                $contact->phones()->create([
                    'phone' => $phone
                ]);
            }
        });

        $contact->load('phones');

        return response()->json([
            'message' => 'Kontak berhasil diperbarui',
            'data' => $contact
        ]);
    }

    // DELETE /api/contacts/{id}
    public function destroy(Request $request, $id)
    {
        $contact = $request->user()
            ->contacts()
            ->find($id);

        if (!$contact) {
            return response()->json([
                'message' => 'Kontak tidak ditemukan'
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'message' => 'Kontak berhasil dihapus'
        ]);
    }
}