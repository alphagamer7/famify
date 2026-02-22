import 'package:flutter/material.dart';

class AppConstants {
  // Supabase Configuration
  // TODO: Replace with your Supabase URL and anon key
  static const String supabaseUrl = 'YOUR_SUPABASE_URL';
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

  // Demo Credentials
  static const String demoEmail = 'john@famify-demo.com';
  static const String demoPassword = 'Demo123!';

  // Category Colors
  static const Map<String, Color> categoryColors = {
    'health': Color(0xFFFDA4AF), // rose-300
    'family': Color(0xFF34D399), // emerald-400
    'activity': Color(0xFF38BDF8), // sky-400
    'chores': Color(0xFFFBBF24), // amber-400
    'other': Color(0xFF94A3B8), // slate-400
  };

  // Meal Colors
  static const Map<String, Color> mealColors = {
    'breakfast': Color(0xFFFB923C), // orange-400
    'lunch': Color(0xFF4ADE80), // green-400
    'dinner': Color(0xFFA78BFA), // purple-400
    'snack': Color(0xFFF472B6), // pink-400
  };

  // Member Colors
  static const Map<String, Color> memberColors = {
    'John': Color(0xFF3B82F6), // blue-500
    'Patricia': Color(0xFF10B981), // emerald-500
    'Julia': Color(0xFFF97316), // orange-500
  };
}
