/**
 * Lead Detail Page Component
 * 
 * Shows comprehensive information about a specific lead including timeline and activities
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLead } from '@/hooks/useLeads';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Star,
  Clock,
  User,
  TrendingUp
} from 'lucide-react';

export const LeadDetailPage: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const { lead, activities, isLoading, error } = useLead(leadId || null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'closed_won': return 'bg-emerald-100 text-emerald-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'form_submitted': return <User className="h-4 w-4" />;
      case 'email_sent': return <Mail className="h-4 w-4" />;
      case 'status_changed': return <TrendingUp className="h-4 w-4" />;
      case 'score_changed': return <Star className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/leads">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
          <div className="animate-pulse h-8 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/leads">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              {error ? 'Error loading lead data.' : 'Lead not found.'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/leads">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-600">{lead.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(lead.status)}>
            {lead.status.replace('_', ' ')}
          </Badge>
          <Badge className={getPriorityColor(lead.priority)}>
            {lead.priority}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Information */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
              <CardDescription>Contact details and basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{lead.email}</div>
                  </div>
                </div>
                
                {lead.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{lead.phone}</div>
                    </div>
                  </div>
                )}
                
                {lead.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Company</div>
                      <div className="font-medium">{lead.company}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Created</div>
                    <div className="font-medium">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {lead.industry && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Industry</div>
                  <Badge variant="outline">{lead.industry}</Badge>
                </div>
              )}

              {lead.company_size && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Company Size</div>
                  <div className="font-medium">{lead.company_size} employees</div>
                </div>
              )}

              {lead.timeline_expectation && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Timeline</div>
                  <div className="font-medium">{lead.timeline_expectation}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No activities recorded yet
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{activity.title}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.created_at).toLocaleString()}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                        )}
                        {activity.automated && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Automated
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Score */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Score</CardTitle>
              <CardDescription>Qualification score out of 100</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {lead.lead_score}
                </div>
                <div className="text-sm text-gray-500">
                  {lead.lead_score >= 80 ? 'High Quality' :
                   lead.lead_score >= 60 ? 'Medium Quality' :
                   lead.lead_score >= 40 ? 'Low Quality' : 'Very Low Quality'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Source */}
          <Card>
            <CardHeader>
              <CardTitle>Source Information</CardTitle>
              <CardDescription>How this lead found you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">Source</div>
                <Badge variant="outline">
                  {lead.source.replace('_', ' ')}
                </Badge>
              </div>

              {lead.utm_source && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">UTM Source</div>
                  <div className="text-sm">{lead.utm_source}</div>
                </div>
              )}

              {lead.utm_campaign && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Campaign</div>
                  <div className="text-sm">{lead.utm_campaign}</div>
                </div>
              )}

              {lead.landing_page && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Landing Page</div>
                  <div className="text-sm truncate">{lead.landing_page}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assessment Data */}
          {lead.assessment_completed && (
            <Card>
              <CardHeader>
                <CardTitle>Assessment Results</CardTitle>
                <CardDescription>Process assessment completion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assessment Score</span>
                  <span className="font-medium">{lead.assessment_score || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed</span>
                  <Badge variant="outline" className="text-green-600">
                    Yes
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Update Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 