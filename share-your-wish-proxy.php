<?php
// Proxy requests to the Google Apps Script backend to avoid browser CORS errors.

const SHEET_ENDPOINT = 'https://script.google.com/a/macros/salesforce.com/s/AKfycbzpy8--MuXzqbUJfcYZpMY09-Ud6_rnUb_YND5szlg_Ow887rkap5_-E6rdxH1NQDiWRQ/exec';

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
        $response = file_get_contents($targetUrl);
        $statusCode = http_response_code_from_headers($http_response_header ?? []);
    } elseif ($method === 'POST') {
        $postData = http_build_query($_POST);
        [$response, $statusCode] = forward_post_request(SHEET_ENDPOINT, $postData);
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

function forward_post_request(string $url, string $postData): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $postData,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
    ]);

    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE) ?: null;
    curl_close($ch);

    return [$response, $statusCode];
}

function http_response_code_from_headers(array $headers): ?int
{
    foreach ($headers as $header) {
        if (stripos($header, 'HTTP/') === 0) {
            $parts = explode(' ', $header);
            return isset($parts[1]) ? (int) $parts[1] : null;
        }
    }

    return null;
}
