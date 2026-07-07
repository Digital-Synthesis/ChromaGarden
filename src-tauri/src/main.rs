// Prevents an additional console window on Windows in release mode
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

#[tauri::command]
async fn run_installer(path: String) -> Result<(), String> {
    use std::process::Command;

    Command::new("msiexec")
        .arg("/i")
        .arg(&path)
        .arg("/passive")
        .spawn()
        .map_err(|e| format!("Failed to launch installer: {}", e))?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![commands::greet, run_installer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}