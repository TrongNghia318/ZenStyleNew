<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    // GET /api/feedbacks?item_id=1
    public function index(Request $request)
{
    $itemId = $request->query('item_id');

    if (!$itemId) {
        return response()->json(['message' => 'item_id is required'], 400);
    }

    $feedbacks = Feedback::where('item_id', $itemId)
        ->with(['client:client_id,name', 'user:user_id,name,role']) // Thêm role
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($feedbacks);
}

    // POST /api/feedbacks
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id'   => 'required|exists:inventories,item_id',
            'rating'    => 'required|integer|min:1|max:5',
            'comments'  => 'nullable|string',
        ]);

        $authenticatedUser = $request->user();
        
        $feedbackData = [
            'item_id' => $validated['item_id'],
            'rating' => $validated['rating'],
            'comments' => $validated['comments'],
        ];

        // Kiểm tra loại user và gán ID tương ứng
        if ($authenticatedUser instanceof \App\Models\User) {
            // Nhân viên đánh giá
            $feedbackData['user_id'] = $authenticatedUser->user_id;
        } elseif ($authenticatedUser instanceof \App\Models\Client) {
            // Khách hàng đánh giá
            $feedbackData['client_id'] = $authenticatedUser->client_id;
        } else {
            return response()->json(['message' => 'Invalid user type'], 400);
        }

        $feedback = Feedback::create($feedbackData);

        // Load relationship tương ứng
       // Load relationship tương ứng
$relationship = isset($feedbackData['user_id']) ? 'user:user_id,name,role' : 'client:client_id,name';

return response()->json([
    'message' => 'Feedback submitted successfully',
    'data' => $feedback->load($relationship),
], 201);
    }
}