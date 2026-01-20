/**
 * Login Panel Component
 * Simple panel with login content
 */
import { requireElement } from "iemjs";
import { doLogin } from "../core/app-control.js";

/**
 * Creates a login panel with HTML content
 */
export const LoginPanel = {
    xtype: "panel",
    html: `
            <div class="login-panel">
                <div class="login-header">
                    <img src="/images/nws.png" width="100" alt="NWS Logo" />
                    <h2>Weather.IM Live</h2>
                </div>

                <div class="login-section primary-section">
                    <h3>Sign In</h3>
                    <p class="welcome-text">Welcome to Weather.IM... please log in with your user account.</p>
                    <form id="login-form" class="login-form">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" id="username" name="username" class="form-control" autocomplete="username" />
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" class="form-control" autocomplete="current-password" />
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Login</button>
                            <button type="button" id="debug-btn" class="btn btn-secondary">Debug</button>
                        </div>
                        <div class="form-footer">
                            <a href="/pwupdate.php">Forgot your password?</a>
                        </div>
                    </form>
                </div>

                <div class="login-section">
                    <h3>Anonymous Access</h3>
                    <p>You can login to this service without registering. Note that anonymous users cannot chat within rooms or save preferences.</p>
                    <button type="button" id="anonymous-btn" class="btn btn-secondary btn-block">
                        Login Anonymously
                    </button>
                </div>

                <div class="login-section">
                    <h3>New User?</h3>
                    <p>Due to spam prevention, new users must register for an account.</p>
                    <a href="/create.php" class="btn btn-secondary btn-block">Create Account</a>
                </div>
            </div>
        `,
    border: false,
    autoScroll: true,
    listeners: {
        afterrender: () => {
            // Attach event listeners after panel is rendered
            const form = requireElement("login-form");
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                doLogin();
            });

            const debugBtn = requireElement("debug-btn");
            debugBtn.addEventListener("click", () => {
                Ext.getCmp("debug").show();
            });

            const anonBtn = requireElement("anonymous-btn");
            anonBtn.addEventListener("click", () => {
                Application.doAnonymousLogin();
            });
        },
    },
};
