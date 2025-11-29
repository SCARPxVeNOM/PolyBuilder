"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const POLYBUILDER_API = 'https://polybuilder.vercel.app/api';
function activate(context) {
    console.log('PolyBuilder extension activated!');
    // Register commands
    const commands = [
        {
            name: 'polybuilder.compile',
            handler: compileContract,
        },
        {
            name: 'polybuilder.deploy',
            handler: deployContract,
        },
        {
            name: 'polybuilder.analyze',
            handler: analyzeContract,
        },
        {
            name: 'polybuilder.optimize',
            handler: optimizeGas,
        },
        {
            name: 'polybuilder.aiAssist',
            handler: aiAssist,
        },
        {
            name: 'polybuilder.templates',
            handler: browseTemplates,
        },
        {
            name: 'polybuilder.openStudio',
            handler: openWebStudio,
        },
    ];
    commands.forEach(({ name, handler }) => {
        context.subscriptions.push(vscode.commands.registerCommand(name, handler));
    });
    // Auto-analyze on save
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
        const config = vscode.workspace.getConfiguration('polybuilder');
        if (config.get('autoAnalyze') && document.languageId === 'solidity') {
            analyzeContract();
        }
    }));
    // Status bar
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(shield) PolyBuilder';
    statusBarItem.tooltip = 'Click to open PolyBuilder';
    statusBarItem.command = 'polybuilder.openStudio';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}
async function compileContract() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'solidity') {
        vscode.window.showErrorMessage('Please open a Solidity file');
        return;
    }
    const code = editor.document.getText();
    const fileName = editor.document.fileName.split(/[\\/]/).pop() || 'Contract.sol';
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Compiling contract...',
        cancellable: false,
    }, async () => {
        try {
            const response = await axios_1.default.post(`${POLYBUILDER_API}/compile`, {
                code,
                fileName,
            });
            if (response.data.success) {
                vscode.window.showInformationMessage(`✅ Compiled successfully: ${response.data.contractName}`);
                return response.data;
            }
            else {
                vscode.window.showErrorMessage(`Compilation failed: ${response.data.error}`);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error.response?.data?.error || error.message}`);
        }
    });
}
async function deployContract() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'solidity') {
        vscode.window.showErrorMessage('Please open a Solidity file');
        return;
    }
    const config = vscode.workspace.getConfiguration('polybuilder');
    const privateKey = config.get('privateKey');
    const network = config.get('defaultNetwork') || 'amoy';
    if (!privateKey) {
        const input = await vscode.window.showInputBox({
            prompt: 'Enter your private key (will be stored securely)',
            password: true,
        });
        if (input) {
            await config.update('privateKey', input, vscode.ConfigurationTarget.Global);
        }
        else {
            return;
        }
    }
    const code = editor.document.getText();
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Deploying to ${network}...`,
        cancellable: false,
    }, async () => {
        try {
            const response = await axios_1.default.post(`${POLYBUILDER_API}/deploy`, {
                code,
                network,
                privateKey: config.get('privateKey'),
            });
            if (response.data.success) {
                const action = await vscode.window.showInformationMessage(`✅ Deployed to ${response.data.contractAddress}`, 'View on Explorer', 'Copy Address');
                if (action === 'View on Explorer') {
                    vscode.env.openExternal(vscode.Uri.parse(`https://${network === 'polygon' ? '' : network + '.'}polygonscan.com/address/${response.data.contractAddress}`));
                }
                else if (action === 'Copy Address') {
                    vscode.env.clipboard.writeText(response.data.contractAddress);
                }
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Deployment failed: ${error.response?.data?.error || error.message}`);
        }
    });
}
async function analyzeContract() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'solidity') {
        return;
    }
    const code = editor.document.getText();
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Analyzing contract security...',
        cancellable: false,
    }, async () => {
        try {
            const response = await axios_1.default.post(`${POLYBUILDER_API}/security/scan`, {
                contractCode: code,
                contractName: 'Contract',
            });
            const result = response.data;
            const { summary } = result;
            if (summary.critical > 0 || summary.high > 0) {
                vscode.window.showWarningMessage(`⚠️ Found ${summary.totalIssues} issues: ${summary.critical} critical, ${summary.high} high`, 'View Details').then((action) => {
                    if (action === 'View Details') {
                        showAnalysisResults(result);
                    }
                });
            }
            else {
                vscode.window.showInformationMessage(`✅ No critical issues found (${summary.totalIssues} total issues)`);
            }
        }
        catch (error) {
            console.error('Analysis error:', error);
        }
    });
}
async function optimizeGas() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'solidity') {
        return;
    }
    const code = editor.document.getText();
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Analyzing gas optimization...',
        cancellable: false,
    }, async () => {
        try {
            const response = await axios_1.default.post(`${POLYBUILDER_API}/analytics/contract`, {
                contractCode: code,
            });
            const result = response.data;
            vscode.window.showInformationMessage(`Gas Optimization Score: ${result.gasOptimizationScore}%`, 'View Recommendations').then((action) => {
                if (action === 'View Recommendations') {
                    showOptimizationResults(result);
                }
            });
        }
        catch (error) {
            console.error('Optimization error:', error);
        }
    });
}
async function aiAssist() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const selection = editor.selection;
    const code = selection.isEmpty
        ? editor.document.getText()
        : editor.document.getText(selection);
    const question = await vscode.window.showInputBox({
        prompt: 'What would you like help with?',
        placeHolder: 'e.g., Explain this function, Fix this bug, Optimize this code',
    });
    if (!question) {
        return;
    }
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'AI Assistant thinking...',
        cancellable: false,
    }, async () => {
        try {
            const response = await axios_1.default.post(`${POLYBUILDER_API}/ai/chat`, {
                message: question,
                context: code,
            });
            const panel = vscode.window.createWebviewPanel('polybuilderAI', 'PolyBuilder AI Assistant', vscode.ViewColumn.Beside, { enableScripts: true });
            panel.webview.html = getAIResultHTML(response.data.message);
        }
        catch (error) {
            vscode.window.showErrorMessage(`AI Error: ${error.response?.data?.error || error.message}`);
        }
    });
}
async function browseTemplates() {
    try {
        const response = await axios_1.default.get(`${POLYBUILDER_API}/marketplace/templates?limit=50`);
        const templates = response.data.templates;
        const items = templates.map((t) => ({
            label: t.name,
            description: `${t.category} - ${t.price === 0 ? 'Free' : '$' + t.price}`,
            detail: t.description,
            template: t,
        }));
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a template to insert',
        });
        if (selected) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit((editBuilder) => {
                    editBuilder.insert(editor.selection.active, selected.template.code);
                });
            }
            else {
                const doc = await vscode.workspace.openTextDocument({
                    content: selected.template.code,
                    language: 'solidity',
                });
                vscode.window.showTextDocument(doc);
            }
        }
    }
    catch (error) {
        vscode.window.showErrorMessage('Failed to load templates');
    }
}
function openWebStudio() {
    vscode.env.openExternal(vscode.Uri.parse('https://polybuilder.vercel.app/studio'));
}
function showAnalysisResults(result) {
    const panel = vscode.window.createWebviewPanel('polybuilderAnalysis', 'Security Analysis Results', vscode.ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = getAnalysisHTML(result);
}
function showOptimizationResults(result) {
    const panel = vscode.window.createWebviewPanel('polybuilderOptimization', 'Gas Optimization Results', vscode.ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = getOptimizationHTML(result);
}
function getAIResultHTML(message) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: system-ui; padding: 20px; }
        pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h2>AI Assistant Response</h2>
      <div>${message.replace(/\n/g, '<br>')}</div>
    </body>
    </html>
  `;
}
function getAnalysisHTML(result) {
    const vulnerabilities = result.vulnerabilities || [];
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: system-ui; padding: 20px; }
        .vulnerability { margin: 12px 0; padding: 12px; border-left: 4px solid; }
        .critical { border-color: #dc2626; background: #fee2e2; }
        .high { border-color: #ea580c; background: #ffedd5; }
        .medium { border-color: #f59e0b; background: #fef3c7; }
        .low { border-color: #10b981; background: #d1fae5; }
      </style>
    </head>
    <body>
      <h2>Security Analysis Results</h2>
      <p><strong>Total Issues:</strong> ${result.summary.totalIssues}</p>
      ${vulnerabilities.map((v) => `
        <div class="vulnerability ${v.severity}">
          <h3>${v.title}</h3>
          <p><strong>Severity:</strong> ${v.severity.toUpperCase()}</p>
          <p>${v.description}</p>
          <p><strong>Recommendation:</strong> ${v.recommendation}</p>
        </div>
      `).join('')}
    </body>
    </html>
  `;
}
function getOptimizationHTML(result) {
    const recommendations = result.recommendations || [];
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: system-ui; padding: 20px; }
        .score { font-size: 48px; font-weight: bold; color: #8b5cf6; }
        .recommendation { margin: 12px 0; padding: 12px; background: #f5f5f5; border-radius: 6px; }
      </style>
    </head>
    <body>
      <h2>Gas Optimization Analysis</h2>
      <div class="score">${result.gasOptimizationScore}%</div>
      <h3>Recommendations</h3>
      ${recommendations.map((r) => `
        <div class="recommendation">
          <h4>${r.title}</h4>
          <p>${r.description}</p>
        </div>
      `).join('')}
    </body>
    </html>
  `;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map