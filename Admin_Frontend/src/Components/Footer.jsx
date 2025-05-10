import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Github, Slack, Mail } from "lucide-react";

function AdminFooter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const showCustomModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const showSystemStatus = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "System Status",
      <div>
        <p className="text-sm">
          All systems are currently operational. Last system update: May 9,
          2025.
        </p>
        <h4 className="font-semibold mt-2">Recent Maintenance</h4>
        <p className="text-sm">
          Database optimization completed on May 7, 2025. No downtime was
          experienced.
        </p>
        <h4 className="font-semibold mt-2">Upcoming Maintenance</h4>
        <p className="text-sm">
          Scheduled server maintenance on May 15, 2025 from 2:00 AM to 4:00 AM
          UTC. Brief service interruptions may occur during this period.
        </p>
      </div>
    );
  };

  const showContact = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Contact IT Support",
      <div>
        <p className="text-sm">
          Need technical assistance? Our IT support team is available to help:
        </p>
        <h4 className="font-semibold mt-2">IT Helpdesk</h4>
        <p className="text-sm">Email: itsupport@adminpanel.com</p>
        <p className="text-sm">Phone: +1 (555) 987-6543</p>
        <p className="text-sm">Hours: 24/7 Support</p>
        <h4 className="font-semibold mt-2">Priority Support</h4>
        <p className="text-sm">
          For urgent issues, use our Slack channel #urgent-support or call the
          emergency line at +1 (555) 123-4567.
        </p>
      </div>
    );
  };

  const showPrivacyPolicy = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Admin Privacy Policy",
      <div>
        <p className="text-sm">
          This Privacy Policy outlines how we handle data within the admin panel
          system.
        </p>
        <h4 className="font-semibold mt-2">1. Data Collection & Usage</h4>
        <p className="text-sm">
          We log administrative actions for security and audit purposes. Your
          login sessions, modifications to system settings, and user management
          activities are recorded.
        </p>
        <h4 className="font-semibold mt-2">2. Security Measures</h4>
        <p className="text-sm">
          All data is encrypted at rest and in transit. Two-factor
          authentication is required for all administrative access, and session
          timeouts are enforced after 15 minutes of inactivity.
        </p>
        <h4 className="font-semibold mt-2">3. Data Retention</h4>
        <p className="text-sm">
          System logs are retained for 90 days. After this period, they are
          automatically archived and can only be accessed by the security team
          with proper authorization.
        </p>
        <h4 className="font-semibold mt-2">4. Administrator Rights</h4>
        <p className="text-sm">
          You can request your activity logs by contacting the security team at{" "}
          <a href="mailto:security@adminpanel.com" className="text-blue-400">
            security@adminpanel.com
          </a>
        </p>
      </div>
    );
  };

  const showTermsOfService = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Terms of Use",
      <div>
        <p className="text-sm">
          By accessing this admin panel, you agree to the following terms:
        </p>
        <h4 className="font-semibold mt-2">1. Authentication & Access</h4>
        <p className="text-sm">
          You are responsible for maintaining the confidentiality of your
          credentials. Any activity performed under your account will be
          attributed to you.
        </p>
        <h4 className="font-semibold mt-2">2. Acceptable Use</h4>
        <p className="text-sm">
          The admin panel must only be used for authorized business purposes.
          Unauthorized access to data or system functions is strictly
          prohibited.
        </p>
        <h4 className="font-semibold mt-2">3. Data Management</h4>
        <p className="text-sm">
          You must handle all data according to company policies and applicable
          regulations. Exporting sensitive data requires appropriate
          authorization.
        </p>
        <h4 className="font-semibold mt-2">4. Compliance</h4>
        <p className="text-sm">
          Violation of these terms may result in account suspension. For
          questions, contact{" "}
          <a href="mailto:compliance@adminpanel.com" className="text-blue-400">
            compliance@adminpanel.com
          </a>
        </p>
      </div>
    );
  };

  const showDocumentation = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Documentation",
      <div>
        <p className="text-sm">
          Access our comprehensive admin documentation to help you navigate and
          use the system effectively:
        </p>
        <h4 className="font-semibold mt-2">Quick Start Guides</h4>
        <p className="text-sm">
          Our getting started documentation covers basic navigation, user
          management, and common administrative tasks.
        </p>
        <h4 className="font-semibold mt-2">API Documentation</h4>
        <p className="text-sm">
          Full API reference with examples and integration guides is available
          in the developer portal.
        </p>
        <h4 className="font-semibold mt-2">Video Tutorials</h4>
        <p className="text-sm">
          Visit our learning center for step-by-step video tutorials on advanced
          features.
        </p>
      </div>
    );
  };

  const showFAQ = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "FAQ",
      <div>
        <p className="text-sm">Common questions about the admin panel:</p>
        <h4 className="font-semibold mt-2">
          1. How do I reset a user's password?
        </h4>
        <p className="text-sm">
          Navigate to User Management {">"} Select User {">"} Actions {">"}{" "}
          Reset Password.
        </p>
        <h4 className="font-semibold mt-2">2. Can I export system reports?</h4>
        <p className="text-sm">
          Yes, all reports can be exported in CSV, Excel, or PDF formats through
          the Reports section.
        </p>
        <h4 className="font-semibold mt-2">
          3. How do I set up automated backups?
        </h4>
        <p className="text-sm">
          Configure backup schedules in System Settings {">"} Backup & Recovery{" "}
          {">"}
          Scheduled Tasks.
        </p>
      </div>
    );
  };

  const showReleaseNotes = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Release Notes",
      <div>
        <p className="text-sm">
          Stay informed about the latest updates and improvements to our admin
          system:
        </p>
        <h4 className="font-semibold mt-2">Version 3.8.2 (May 5, 2025)</h4>
        <p className="text-sm">
          • Enhanced security features with improved 2FA options
          <br />
          • Updated dashboard analytics with new visualization options
          <br />
          • Fixed user permission cache issue
          <br />• Improved API response times
        </p>
        <h4 className="font-semibold mt-2">Version 3.8.1 (April 22, 2025)</h4>
        <p className="text-sm">
          • Added bulk user import/export functionality
          <br />
          • New dark mode theme option
          <br />
          • Performance optimizations for large datasets
          <br />• Accessibility improvements throughout the interface
        </p>
      </div>
    );
  };

  return (
    <div>
      <footer className="bg-gray-900 p-8 text-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Branding and Description */}
          <div>
            <h3 className="text-lg font-bold mb-4">Admin Dashboard</h3>
            <p className="text-sm text-gray-300 mb-4">
              Powerful tools for system administrators and content managers.
              Secure, efficient, and easy to use.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/admin-dashboard" aria-label="GitHub">
                <Github className="h-6 w-6 text-gray-300 hover:text-white" />
              </a>
              <a href="https://slack.com/admin-dashboard" aria-label="Slack">
                <Slack className="h-6 w-6 text-gray-300 hover:text-white" />
              </a>
              <a href="mailto:admin@dashboard.com" aria-label="Email">
                <Mail className="h-6 w-6 text-gray-300 hover:text-white" />
              </a>
            </div>
          </div>

          {/* System Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">System</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showSystemStatus}
                >
                  System Status
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showReleaseNotes}
                >
                  Release Notes
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "Security",
                      <p className="text-sm">
                        Review our security protocols and best practices for
                        maintaining system integrity.
                      </p>
                    )
                  }
                >
                  Security
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "Analytics",
                      <p className="text-sm">
                        Access system usage statistics and performance metrics.
                      </p>
                    )
                  }
                >
                  Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showContact}
                >
                  Contact IT Support
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showDocumentation}
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showFAQ}
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "Training",
                      <p className="text-sm">
                        Access our library of training materials and
                        certification courses.
                      </p>
                    )
                  }
                >
                  Training
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "License",
                      <p className="text-sm">
                        Review your software license agreement and terms of use.
                      </p>
                    )
                  }
                >
                  License
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={(e) =>
                    showCustomModal(
                      "Compliance",
                      <p className="text-sm">
                        Information about GDPR, HIPAA, and other regulatory
                        compliance.
                      </p>
                    )
                  }
                >
                  Compliance
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showPrivacyPolicy}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  className="text-gray-300 font-normal hover:text-white hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showTermsOfService}
                >
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Version and Copyright Notice */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-300">
            Version 3.8.2 • © 2025 Admin Dashboard • All rights reserved
          </p>
        </div>
      </footer>

      {/* Custom Modal Implementation */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto text-white">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-black">{modalTitle}</h2>
              <button
                onClick={closeModal}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="text-black">{modalContent}</div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default AdminFooter;
