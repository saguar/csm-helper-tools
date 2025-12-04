<?php
// Proxy requests to the Google Apps Script backend to avoid browser CORS errors.
//
// Note: use the public "/macros/s/" execution URL (not the domain-scoped
// "/a/macros/<domain>/" editor URL) so unauthenticated clients can reach the
// deployed Web App without redirects.

const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx1uGy9Sxk9bWRgm9qtuU-CzEaBuHxpE4BWxoTQp1ERkYjdftDITeGLSYcLDKR0SLeMaQ/exec';

// Preflight handling for browsers.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $queryString = $_SERVER['QUERY_STRING'] ?? '';
        $targetUrl = SHEET_ENDPOINT . ($queryString ? '?' . $queryString : '');
        [$response, $statusCode] = forward_request('GET', $targetUrl);
    } elseif ($method === 'POST') {
        $postData = http_build_query($_POST);
        [$response, $statusCode] = forward_request('POST', SHEET_ENDPOINT, $postData);
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        exit;
    }

    if ($response === false) {
        http_response_code(502);
        echo json_encode(['success' => false, 'message' => 'Failed to reach wish backend']);
        exit;
    }

    if ($statusCode) {
        http_response_code($statusCode);
    }

    echo $response;
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Proxy error: ' . $error->getMessage()]);
}

function forward_request(string $method, string $url, ?string $postData = null): array
{
    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 5,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
    ];

    if ($method === 'POST') {
        $options[CURLOPT_POST] = true;
        $options[CURLOPT_POSTFIELDS] = $postData ?? '';
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, $options);

    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE) ?: null;
    curl_close($ch);

    return [$response, $statusCode];
}
