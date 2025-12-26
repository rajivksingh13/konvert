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
        try {
            Desktop desktop = Desktop.getDesktop();
            if (desktop.isSupported(Desktop.Action.BROWSE)) {
                desktop.browse(new URI("http://localhost:8080"));
                System.out.println("\n✅ Konvert is running!");
                System.out.println("🌐 Browser opened automatically.");
                System.out.println("📡 Server: http://localhost:8080");
                System.out.println("🔒 Running locally - No internet required!\n");
            }
        } catch (Exception e) {
            System.out.println("\n✅ Konvert is running!");
            System.out.println("🌐 Please open http://localhost:8080 in your browser");
            System.out.println("🔒 Running locally - No internet required!\n");
        }
    }
}
