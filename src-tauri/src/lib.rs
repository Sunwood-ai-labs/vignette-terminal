use portable_pty::{native_pty_system, CommandBuilder, MasterPty, PtySize};
use serde::Deserialize;
use std::{
    io::{Read, Write},
    sync::Mutex,
    thread,
};
use tauri::{AppHandle, Emitter, Manager, State};

struct TerminalState {
    pty: Mutex<Option<Box<dyn MasterPty + Send>>>,
    writer: Mutex<Option<Box<dyn Write + Send>>>,
}

#[derive(Deserialize)]
struct TerminalSize {
    cols: u16,
    rows: u16,
}

#[tauri::command]
fn start_terminal(app: AppHandle, state: State<TerminalState>, size: TerminalSize) -> Result<(), String> {
    let mut active_pty = state.pty.lock().map_err(|error| error.to_string())?;
    if active_pty.is_some() {
        return Ok(());
    }

    let pty_system = native_pty_system();
    let pair = pty_system
        .openpty(PtySize {
            rows: size.rows,
            cols: size.cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|error| error.to_string())?;

    let mut command = if let Ok(shell) = std::env::var("MEDIA_TERMINAL_SHELL") {
        CommandBuilder::new(shell)
    } else if cfg!(windows) {
        let mut cmd = CommandBuilder::new("cmd.exe");
        cmd.arg("/K");
        cmd.arg("prompt $P$G");
        cmd
    } else {
        CommandBuilder::new(std::env::var("SHELL").unwrap_or_else(|_| "bash".to_string()))
    };

    command.cwd(std::env::current_dir().map_err(|error| error.to_string())?);
    let mut reader = pair.master.try_clone_reader().map_err(|error| error.to_string())?;
    let writer = pair.master.take_writer().map_err(|error| error.to_string())?;
    let mut child = pair.slave.spawn_command(command).map_err(|error| error.to_string())?;
    let window = app.get_webview_window("main").ok_or("main window not found")?;

    thread::spawn(move || {
        let mut buffer = [0_u8; 8192];
        loop {
            match reader.read(&mut buffer) {
                Ok(0) => break,
                Ok(count) => {
                    let text = String::from_utf8_lossy(&buffer[..count]).to_string();
                    let _ = window.emit("terminal-data", text);
                }
                Err(_) => break,
            }
        }
    });

    thread::spawn(move || {
        let _ = child.wait();
    });

    *active_pty = Some(pair.master);
    *state.writer.lock().map_err(|error| error.to_string())? = Some(writer);
    Ok(())
}

#[tauri::command]
fn write_terminal(state: State<TerminalState>, data: String) -> Result<(), String> {
    let mut active_writer = state.writer.lock().map_err(|error| error.to_string())?;
    let writer = active_writer.as_mut().ok_or("terminal is not running")?;
    writer.write_all(data.as_bytes()).map_err(|error| error.to_string())
}

#[tauri::command]
fn resize_terminal(state: State<TerminalState>, size: TerminalSize) -> Result<(), String> {
    let mut active_pty = state.pty.lock().map_err(|error| error.to_string())?;
    let pty = active_pty.as_mut().ok_or("terminal is not running")?;
    pty.resize(PtySize {
        rows: size.rows,
        cols: size.cols,
        pixel_width: 0,
        pixel_height: 0,
    })
    .map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(TerminalState {
            pty: Mutex::new(None),
            writer: Mutex::new(None),
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            start_terminal,
            write_terminal,
            resize_terminal
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
