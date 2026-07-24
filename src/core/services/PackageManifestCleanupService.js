const fs = require('fs-extra');
const logger = require('../infra/Logger');
const pathResolver = require('../infra/PathResolver');

class PackageManifestCleanupService {
    constructor() {
        this.removals = [
            {
                type: 'CleanDataService',
                members: ['DataCloudGeoLocation'],
            },
            {
                type: 'EntitlementProcess',
                members: ['standard case'],
            },
            {
                type: 'ListView',
                members: [
                    'ChangeRequest.AllChangeRequestsDefault',
                    'CommSubscriptionChannelType.All_CommSubscriptionChannelTypes',
                    'EngagementChannelWorkType.My_EngagementChannelWorkTypes',
                    'EngagementChannelWorkType.All_EngagementChannelWorkTypes',
                    'FulfillmentOrder.all_fulfillment_orders',
                    'Incident.AllIncidentsDefault',
                    'Incident.MyIncidents',
                    'PaymentGroup.PaymentGroup',
                    'Problem.AllOpenProblems',
                    'Problem.AllProblemsDefault',
                    'ServiceAppointment.All_ServiceAppointments',
                    'ServiceAppointment.MyPendingAppointments',
                    'ServiceAppointment.MyScheduledAppointments',
                    'ShiftEngagementChannel.My_ShiftEngagementChannels',
                    'ShiftEngagementChannel.All_ShiftEngagementChannels',
                    'ShiftWorkTopic.My_ShiftWorkTopics',
                    'ShiftWorkTopic.All_ShiftWorkTopics',
                ],
            },
            {
                type: 'CustomObject',
                members: [
                    'ChangeRequest',
                    'ChangeRequestRelatedIssue',
                    'ChangeRequestRelatedItem',
                    'CommSubscriptionChannelType',
                    'EngagementChannelWorkType',
                    'FulfillmentOrder',
                    'FulfillmentOrderItemAdjustment',
                    'FulfillmentOrderItemTax',
                    'FulfillmentOrderLineItem',
                    'Incident',
                    'IncidentRelatedItem',
                    'PaymentGroup',
                    'Problem',
                    'ProblemIncident',
                    'ProblemRelatedItem',
                    'ServiceAppointment',
                    'ServiceAppointmentAttendee',
                    'ShiftEngagementChannel',
                    'ShiftWorkTopic',
                ],
            },
            {
                type: 'CustomField',
                members: [
                    'Goal.OrigGoalId__c',
                    'Metric.OrigMetricId__c',
                ],
            },
            {
                type: 'CustomLabels',
                members: [
                    'CustomLabels',
                ],
            },
            {
                type: 'Dashboard',
                members: [
                    'Enablement_sfdcSESv60/Program_Dashboard_sfdcSESv60',
                    'Enablement_sfdcSESv61/Program_Dashboard_sfdcSESv61',
                ],
            },
            {
                type: 'EmailTemplate',
                members: [
                    'unfiled$public',
                ],
            },
            {
                type: 'InstalledPackage',
                members: [
                    'devedapp',
                ],
            },
            {
                type: 'Layout',
                members: [
                    'FulfillmentOrder-Fulfillment Order Layout',
                    'FulfillmentOrderItemAdjustment-Fulfillment Order Item Adjustment Layout',
                    'FulfillmentOrderItemTax-Fulfillment Order Item Tax Layout',
                    'FulfillmentOrderLineItem-Fulfillment Order Product Layout',
                    'PaymentGroup-Payment Group Layout',
                    'ServiceAppointment-Service Appointment Layout',
                    'ShiftWorkTopic-Shift Work Topic Layout',
                    'LiveChatTranscriptActive-Chat Transcript %28In Progress%29 Layout',
                    'LiveChatTranscriptWaiting-Chat Transcript %28Waiting%29 Layout',
                ],
            },
            {
                type: 'MatchingRule',
                members: [
                    'Account.Standard_Account_Match_Rule_v1_0',
                    'Contact.Standard_Contact_Match_Rule_v1_1',
                    'Lead.Standard_Lead_Match_Rule_v1_0',
                ],
            },
            {
                type: 'RecordType',
                members: [
                    'Metric.Completion',
                    'Metric.Progress',
                ],
            },
            {
                type: 'Report',
                members: [
                    'EnablementDashboardReports_sfdcSESv60/Exercise_Completion_Status_by_Section_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Exercise_Completion_Status_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Exercise_Completion_by_Days_to_Complete_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Exercise_Completion_by_User_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Milestone_Completion_Status_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Milestone_Progress_by_User_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Milestone_Progress_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Outcome_Progress_by_User_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Outcome_Progress_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Program_Exercises_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Program_Milestones_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv60/Program_Overview_by_User_sfdcSESv60',
                    'EnablementDashboardReports_sfdcSESv61/Exercise_Completion_Status_by_Section_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Exercise_Completion_Status_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Exercise_Completion_by_Days_to_Complete_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Exercise_Completion_by_User_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Milestone_Completion_Status_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Milestone_Progress_by_User_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Milestone_Progress_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Outcome_Progress_by_User_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Outcome_Progress_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Program_Exercises_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Program_Milestones_sfdcSESv61',
                    'EnablementDashboardReports_sfdcSESv61/Program_Overview_by_User_sfdcSESv61',
                    'unfiled$public/',
                ],
            },
            {
                type: 'StandardValueSetTranslation',
                members: [
                    'AddressCountryCode-nl',
                    'AddressStateCode-nl',
                ],
            },
            {
                type: 'WorkflowFlowAutomation',
                members: [
                    'sfdc_default_ReportExport_Protection_Flow',
                ],
            },
            {
                type: 'TopicsForObjects',
                members: [
                    'ChangeRequest',
                    'Incident',
                    'Problem',
                    'ServiceAppointment',
                    'ShiftEngagementChannel',
                    'ShiftWorkTopic',
                ],
            },
            {
                type: 'WebLink',
                members: [
                    'Incident.IncidentSource',
                ],
            },
            {
                type: 'ManagedContentType',
                members: ['cms_document', 'cms_image', 'news'],
            },
            {
                type: 'Settings',
                members: [
                    'Analytics',
                    'Campaign',
                    'Communities',
                    'DevHub',
                    'EinsteinAI',
                    'EmailAdministration',
                    'EmployeeUser',
                    'EncryptionKey',
                    'Pardot',
                    'PlatformEncryption',
                    'SceGlobalModelOptOut',
                    'SecurityAgent',
                    'SecurityHub',
                    'Site',
                    'Territory2',
                    'CommSubscriptionChannelType',
                    'FulfillmentOrder',
                    'ServiceAppointmentAttendee',
                ],
            },
            {
                type: 'StandardValueSet',
                members: [
                    'ServiceAppointmentStatus',
                ],
            },
            {
                type: 'Profile',
                members: [
                    'Admin',
                    'Analytics Cloud Integration User',
                    'Analytics Cloud Security User',
                    'Anypoint Integration',
                    'Authenticated Website',
                    'ContractManager',
                    'Cross Org Data Proxy User',
                    'Custom%3A Marketing Profile',
                    'Custom%3A Sales Profile',
                    'Custom%3A Support Profile',
                    'Customer Community Login User',
                    'Customer Community Plus Login User',
                    'Customer Community Plus User',
                    'Customer Community User',
                    'Customer Portal Manager Custom',
                    'Customer Portal Manager Standard',
                    'External Apps Login User',
                    'External Identity User',
                    'Force%2Ecom - App Subscription User',
                    'Force%2Ecom - Free User',
                    'Gold Partner User',
                    'High Volume Customer Portal User',
                    'HighVolumePortal',
                    'Identity User',
                    'MarketingProfile',
                    'Minimum Access - API Only Integrations',
                    'Minimum Access - Salesforce',
                    'Partner App Subscription User',
                    'Partner Community Login User',
                    'Partner Community User',
                    'PlatformPortal',
                    'Read Only',
                    'Silver Partner User',
                    'SolutionManager',
                    'Standard',
                    'StandardAul',
                    'Work%2Ecom Only User',
                ],
            },
        ];
    }

    escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    removeMembersFromType(xml, metadataType, membersToRemove) {
        const typePattern = new RegExp(`<types>[\\s\\S]*?<name>${this.escapeRegExp(metadataType)}</name>[\\s\\S]*?</types>`, 'm');
        const match = xml.match(typePattern);

        if (!match) {
            return { xml, removed: [] };
        }

        const block = match[0];
        const lines = block.split(/\r?\n/);
        const remainingLines = [];
        const removed = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('<members>') && trimmed.endsWith('</members>')) {
                const memberName = trimmed.slice(9, -10).trim();
                if (membersToRemove.includes(memberName)) {
                    removed.push(memberName);
                    continue;
                }
            }
            remainingLines.push(line);
        }

        const cleanedBlock = remainingLines.join('\n').trim();
        if (!cleanedBlock.includes('<members>')) {
            return { xml: xml.replace(block, ''), removed };
        }

        return { xml: xml.replace(block, cleanedBlock), removed };
    }

    async execute({ manifestFilePath, dryRun = false } = {}) {
        const resolvedManifestPath = manifestFilePath
            ? pathResolver.resolveFromCwd(manifestFilePath)
            : pathResolver.resolveFromCwd('manifest/package.xml');

        if (!await fs.pathExists(resolvedManifestPath)) {
            throw new Error(`Arquivo de manifest não encontrado: ${resolvedManifestPath}`);
        }

        const originalXml = await fs.readFile(resolvedManifestPath, 'utf8');
        let updatedXml = originalXml;
        const removedSummary = [];

        for (const entry of this.removals) {
            const result = this.removeMembersFromType(updatedXml, entry.type, entry.members);
            updatedXml = result.xml;
            if (result.removed.length > 0) {
                removedSummary.push({ type: entry.type, members: result.removed });
            }
        }

        if (dryRun) {
            logger.info(`Dry run para ${resolvedManifestPath}`);
            return {
                manifestFilePath: resolvedManifestPath,
                removedSummary,
                removedCount: removedSummary.reduce((total, item) => total + item.members.length, 0),
                dryRun: true,
            };
        }

        await fs.writeFile(resolvedManifestPath, updatedXml, 'utf8');
        logger.info(`Manifest limpo em ${resolvedManifestPath}`);

        return {
            manifestFilePath: resolvedManifestPath,
            removedSummary,
            removedCount: removedSummary.reduce((total, item) => total + item.members.length, 0),
            dryRun: false,
        };
    }
}

module.exports = new PackageManifestCleanupService();
