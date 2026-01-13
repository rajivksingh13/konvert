package com.konvert;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.awt.Desktop;
import java.net.URI;

@SpringBootApplication
public class KonvertApplication {

    public static void main(String[] args) {
        SpringApplication.run(KonvertApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void openBrowser() {
        // Only open browser if not running in Electron
        // Electron will handle the UI, so we skip browser opening
        String electronMode = System.getProperty("electron.mode");
        if (electronMode != null && electronMode.equals("true")) {
            System.out.println("\n✅ KonvertR backend is running!");
            System.out.println("📡 Server: http://localhost:8080");
            System.out.println("🔒 Running in Electron mode\n");
            return;
        }
        
        // Original behavior for standalone mode
        try {
            Desktop desktop = Desktop.getDesktop();
            if (desktop.isSupported(Desktop.Action.BROWSE)) {
                desktop.browse(new URI("http://localhost:8080"));
                System.out.println("\n✅ KonvertR is running!");
                System.out.println("🌐 Browser opened automatically.");
                System.out.println("📡 Server: http://localhost:8080");
                System.out.println("🔒 Running locally - No internet required!\n");
            }
        } catch (Exception e) {
            System.out.println("\n✅ KonvertR is running!");
            System.out.println("🌐 Please open http://localhost:8080 in your browser");
            System.out.println("🔒 Running locally - No internet required!\n");
        }
    }
}
