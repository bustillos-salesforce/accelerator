const fs = require('fs-extra');
const path = require('path');
const logger = require('../infra/Logger');
const pathResolver = require('../infra/PathResolver');

class PackageManifestCleanupService {
    constructor() {
        this.removals = [
            {
                type: 'externalClientApps',
                members: [],
            },
            {
                type: 'extlClntAppGlobalOauthSets',
                members: [],
            },
            {
                type: 'extlClntAppOauthPolicies',
                members: [],
            },
            {
                type: 'extlClntAppOauthSecuritySettings',
                members: [],
            },
            {
                type: 'extlClntAppOauthSettings',
                members: [],
            },
            {
                type: 'extlClntAppPolicies',
                members: [],
            },
            {
                type: 'certs',
                members: [],
            },
            {
                type: 'iframeWhiteListUrlSettings',
                members: [],
            },
            {
                type: 'flowDefinitions',
                members: [],
            },
            {
                type: 'namedCredentials',
                members: [],
            },
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
                    'ActivationTarget.My_S3_ActivationTargets',
                    'ActivationTarget.All_ActivationTargets',
                    'ActivationTarget.My_ActivationTargets',
                    'ActivationTarget.My_MCIS_ActivationTargets',
                    'ActivationTarget.My_SFMC_ActivationTargets',
                    'AlternativePaymentMethod.AlternativePaymentMethod',
                    'AppointmentInvitation.All_AppointmentInvitations',
                    'AppointmentInvitation.My_AppointmentInvitations',
                    'ApprovalSubmission.All_ApprovalSubmissions',
                    'ApprovalSubmission.My_ApprovalSubmissions',
                    'ApprovalSubmission.Pending_ApprovalSubmissions',
                    'ApprovalSubmissionDetail.All_ApprovalSubmissionDetails',
                    'ApprovalWorkItem.All_ApprovalWorkItems',
                    'ApprovalWorkItem.Assigned_ApprovalWorkItems',
                    'AssetAction.AssetAction',
                    'AssetActionSource.AssetActionSource',
                    'AssetStatePeriod.AssetStatePeriod',
                    'AuthorizationForm.All_AuthorizationForms',
                    'AuthorizationFormConsent.All_AuthorizationFormConsents',
                    'AuthorizationFormDataUse.All_AuthorizationFormDataUses',
                    'AuthorizationFormText.All_AuthorizationFormText',
                    'BusinessBrand.All_BusinessBrands',
                    'BuyerGroup.All_Buyer_Groups',
                    'BuyerGroup.My_Buyer_Groups',
                    'CardPaymentMethod.CardPaymentMethod',
                    'ChangeRequest.AllChangeRequestsDefault',
                    'CollaborationGroup.All_ChatterGroups',
                    'CommSubscriptionChannelType.All_CommSubscriptionChannelTypes',
                    'CommSubscription.All_CommSubscriptions',
                    'CommSubscriptionConsent.All_CommSubscriptionConsents',
                    'CommSubscriptionTiming.All_CommSubscriptionTimings',
                    'ContactPointAddress.All_ContactPointAddresses',
                    'ContactPointConsent.All_ContactPointConsents',
                    'ContactPointEmail.All_ContactPointEmails',
                    'ContactPointPhone.All_ContactPointPhones',
                    'ContactPointTypeConsent.All_ContactPointTypeConsents',
                    'ContactRequest.My_ContactRequests',
                    'ConsumptionSchedule.All_ConsumptionSchedules',
                    'ConsumptionSchedule.My_ConsumptionSchedules',
                    'ContentDocument.OwnedContentDocuments',
                    'Coupon.ALL_Coupons',
                    'CreditMemo.mine',
                    'Customer.All_Customers',
                    'DataAction.All_DataActions',
                    'DataActionTarget.All_DataActionTargets',
                    'DataActionTarget.My_DataActionTargets',
                    'DataGraph.All_DataGraphs',
                    'DataLakeObjectInstance.All_DataLakeObjectInstances',
                    'DataMaskCustomValueLibrary.All_DataMaskCustomValueLibraries',
                    'DataQueryWorkspace.All_DataQueryWorkspaces',
                    'DataQueryWorkspace.My_DataQueryWorkspaces',
                    'DataStream.All_DataStreams',
                    'DataUseLegalBasis.All_DataUseLegalBases',
                    'DataUsePurpose.All_DataUsePurposes',
                    'DigitalWallet.DigitalWallet',
                    'EngagementChannelType.All_EngagementChannelTypes',
                    'EngagementChannelWorkType.My_EngagementChannelWorkTypes',
                    'EngagementChannelWorkType.All_EngagementChannelWorkTypes',
                    'Entitlement.All_Entitlements',
                    'Event.MyRecentEvents',
                    'Event.MyTeamsRecentEvents',
                    'Event.MyTeamsUpcomingEvents',
                    'Event.MyUpcomingEvents',
                    'Event.TodaysAgenda',
                    'ExtDataShare.All_ExtDataShares',
                    'ExtDataShareTarget.All_ExtDataShareTargets',
                    'ExtDataShareTarget.My_ExtDataShareTargets',
                    'FinanceBalanceSnapshot.mine',
                    'FinanceTransaction.mine',
                    'FlowOrchestrationInstance.All_Orchestration_Instances',
                    'FlowOrchestrationWorkItem.ALL_Open_Work_Items',
                    'FlowOrchestrationWorkItem.All_Work_Items',
                    'FulfillmentOrder.all_fulfillment_orders',
                    'Idea.Ideas_Last_7_Days',
                    'Incident.AllIncidentsDefault',
                    'Incident.MyIncidents',
                    'IdentityResolution.All_IdentityResolutions',
                    'Individual.All_Individuals',
                    'Invoice.mine',
                    'LegalEntity.mine',
                    'Location.all_locations',
                    'LocationGroup.LocationGroup',
                    'MarketSegment.All_MarketSegments',
                    'MarketSegmentActivation.All_MarketSegmentActivations',
                    'MktCalculatedInsight.All_MktCalculatedInsights',
                    'MktDataTransform.All_MktDataTransforms',
                    'MktDataTransform.My_MktDataTransforms',
                    'MktMLModel.All_MktMLModels',
                    'MktMLModel.My_MktMLModels',
                    'OperatingHours.All_OperatingHours',
                    'PartyConsent.All_PartyConsents',
                    'Payment.Payment',
                    'PaymentAuthorization.PaymentAuthorization',
                    'PaymentAuthAdjustment.PaymentAuthAdjustment',
                    'PaymentGateway.PaymentGateway',
                    'PaymentGroup.PaymentGroup',
                    'PaymentLineInvoice.PaymentLineInvoice',
                    'Pricebook2.All_Pricebooks',
                    'ProcessException.all_process_exceptions',
                    'Problem.AllOpenProblems',
                    'Problem.AllProblemsDefault',
                    'ProductCatalog.All_Product_Catalogs_List_View',
                    'ProductCategory.Org_ProductCategory_Hierarchy',
                    'ProductCategory.All_Product_Categories_List_View',
                    'ProductCategory.Category_Hierarchy_SM',
                    'Recommendation.All_Recommendations',
                    'Refund.Refund',
                    'RefundLinePayment.RefundLinePayment',
                    'ReturnOrder.All_ReturnOrders',
                    'ReturnOrder.My_ReturnOrders',
                    'Scorecard.AllScorecards',
                    'Scorecard.MyScorecards',
                    'Seller.All_Sellers',
                    'ServiceAppointment.All_ServiceAppointments',
                    'ServiceAppointment.MyPendingAppointments',
                    'ServiceAppointment.MyScheduledAppointments',
                    'ServiceContract.All_ServiceContracts',
                    'ServiceResource.All_ServiceResources',
                    'ServiceResource.My_ServiceResources',
                    'ServiceTerritory.All_ServiceTerritories',
                    'ServiceTerritory.My_ServiceTerritories',
                    'Shift.All_Shifts',
                    'ShiftEngagementChannel.My_ShiftEngagementChannels',
                    'ShiftEngagementChannel.All_ShiftEngagementChannels',
                    'Shift.My_Shifts',
                    'ShiftWorkTopic.My_ShiftWorkTopics',
                    'ShiftWorkTopic.All_ShiftWorkTopics',
                    'SocialPersona.AllSocialPersonas',
                    'Task.CompletedTasks',
                    'Task.DelegatedTasks',
                    'Task.OpenTasks',
                    'Task.OverdueTasks',
                    'Task.RecurringTasks',
                    'Task.TodaysTasks',
                    'Task.UnscheduledTasks',
                    'VoiceCall.My_VoiceCalls',
                    'Waitlist.All_Waitlists',
                    'Waitlist.My_Waitlists',
                    'WebCart.All_WebCarts',
                    'WebCart.Owned_WebCarts',
                    'WorkOrder.All_WorkOrders',
                    'WorkOrder.My_WorkOrders',
                    'WorkType.All_WorkTypes',
                    'WorkType.My_WorkTypes',
                    'WorkTypeGroup.All_WorkTypeGroups',
                    'WorkTypeGroup.My_WorkTypeGroups'
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
        if (membersToRemove.length === 0) {
            return { xml: xml.replace(block, ''), removed: [metadataType] };
        }

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

    async removeMetadataDirectories(projectRoot, metadataTypes) {
        const directoriesToRemove = metadataTypes
            .filter((metadataType) => metadataType && metadataType !== 'Settings')
            .map((metadataType) => path.join(projectRoot, 'force-app', 'main', 'default', metadataType));

        for (const directoryPath of directoriesToRemove) {
            try {
                await fs.remove(directoryPath);
                logger.info(`Diretório removido: ${directoryPath}`);
            } catch (error) {
                logger.warn(`Não foi possível remover o diretório ${directoryPath}: ${error.message}`);
            }
        }
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

        const metadataTypesToRemove = this.removals
            .filter((entry) => entry.members.length === 0)
            .map((entry) => entry.type);

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

        const projectRoot = pathResolver.resolveFromCwd();
        await this.removeMetadataDirectories(projectRoot, metadataTypesToRemove);

        return {
            manifestFilePath: resolvedManifestPath,
            removedSummary,
            removedCount: removedSummary.reduce((total, item) => total + item.members.length, 0),
            dryRun: false,
        };
    }
}

module.exports = new PackageManifestCleanupService();
