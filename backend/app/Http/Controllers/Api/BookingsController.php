<?php

namespace App\Http\Controllers\Api;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;



class BookingsController extends Controller
{
    public function index()
    {
        return Booking::all();
    }

    public function store(Request $request)
    {
        // Validate the incoming data first
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'service' => 'required|string|max:255',
            'stylist' => 'required|string|max:255',
            'room' => 'required|string|max:255',
            'booking_date' => 'required|date',
            'booking_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        // Create a new Booking model instance
        $booking = new Booking;

        // Fill the model with the validated data.
        $booking->name = $validatedData['name'];
        $booking->email = $validatedData['email'];
        $booking->phone = $validatedData['phone'];
        $booking->service = $validatedData['service'];
        $booking->stylist = $validatedData['stylist'];
        $booking->room = $validatedData['room'];
        $booking->booking_date = $validatedData['booking_date'];
        $booking->booking_time = $validatedData['booking_time'];
        $booking->notes = $validatedData['notes'];

        // Save the record to the database
        $booking->save();

        return response()->json($booking, 201);
    }

    // Thêm phương thức mới này
    public function resetAndStore(Request $request)
    {
        // Xóa tất cả các bản ghi và đặt lại bộ đếm ID về 1
        Booking::truncate();

        // Tương tự như phương thức store, tạo bản ghi mới
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'service' => 'required|string|max:255',
            'stylist' => 'required|string|max:255',
            'room' => 'required|string|max:255',
            'booking_date' => 'required|date',
            'booking_time' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        $booking = new Booking;
        $booking->name = $validatedData['name'];
        $booking->email = $validatedData['email'];
        $booking->phone = $validatedData['phone'];
        $booking->service = $validatedData['service'];
        $booking->stylist = $validatedData['stylist'];
        $booking->room = $validatedData['room'];
        $booking->booking_date = $validatedData['booking_date'];
        $booking->booking_time = $validatedData['booking_time'];
        $booking->notes = $validatedData['notes'];

        $booking->save();

        return response()->json($booking, 201);
    }

    public function show(Booking $booking)
    {
        return $booking;
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'service' => 'required|string',
            'stylist' => 'required|string',
            'room' => 'required|string',
            'booking_date' => 'required|date',
            'booking_time' => 'required',
            'notes' => 'nullable|string',
        ]);

        $booking->update($validated);

        return response()->json($booking);
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return response()->json(null, 204);
    }
}