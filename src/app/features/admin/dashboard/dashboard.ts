import {Component, inject, OnInit, signal} from '@angular/core';
import {EventService} from '../../../shared/services/event';
import {CategoryResponseDto, EventResponseDto, EventStatus} from '../../../shared/models/event.models';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggle, MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {SiteConfigurationService} from '../../../shared/services/site-configuration';
import {CategoryService} from '../../../shared/services/category';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltip} from '@angular/material/tooltip';
import {ArticleService} from '../../../shared/services/article';
import {ArticleResponseDto} from '../../../shared/models/article.models';
import {forkJoin} from 'rxjs';
import {UserService} from '../../../shared/services/user';
import {UserResponseDto} from '../../../shared/models/user.models';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatTooltip,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    FormsModule,
    RouterLink,
    DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly categoryService = inject(CategoryService);
  private readonly article = inject(ArticleService);
  private readonly user = inject(UserService);
  readonly siteConfigService = inject(SiteConfigurationService)
  private readonly snackBar = inject(MatSnackBar);

  totalEvents = signal(0)
  upcomingEvents = signal(0)
  ongoingEvents = signal(0)
  nextEvent = signal<EventResponseDto | null>(null);
  alertMessage = signal<string>('')
  categories = signal<CategoryResponseDto[]>([]);
  newCategoryName = signal<string>('')
  articles = signal<ArticleResponseDto[]>([]);
  articleOnSite = signal(0)
  users = signal<UserResponseDto[]>([]);
  usersOnSite = signal (0)
  effectivesUsersOnSite = signal(0)





  ngOnInit(): void {
    this.loadStats()
    this.loadCategories()
  }

  loadStats(): void {
    // forkJoin exécute les requêtes en parallèle et combine les résultats dans un tableau
    forkJoin({
      events: this.eventService.getAll(),
      articles: this.article.getAll(),
      users: this.user.getAll()



    }).subscribe({
      next: ({ events, articles, users }) => {
        //event
        this.totalEvents.set(events.length);
        this.upcomingEvents.set(
          events.filter(e => e.status === EventStatus.EnAttente).length
        );
        this.ongoingEvents.set(
          events.filter(e => e.status === EventStatus.EnCours).length
        );
        const next = events
          .filter(e => e.status === EventStatus.EnAttente)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
        this.nextEvent.set(next ?? null);

        //articles
        this.articles.set(articles);
        this.articleOnSite.set(articles.length);

        //users
        this.users.set(users)
        this.usersOnSite.set(users.length);
        const effective = users
          .filter(u => u.isMembershipUpToDate).length;
        this.effectivesUsersOnSite.set(effective ?? null)

      },
      error: (err) => {
        this.snackBar.open('Erreur lors du chargement des statistiques.', 'Fermer', { duration: 4000 });
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories.set(categories)
    });
  }

  createCategory(): void {
    if (!this.newCategoryName().trim()) return;
    this.categoryService.create(this.newCategoryName()).subscribe({
      next: () => {
        this.snackBar.open('Catégorie créée !', 'Fermer', {duration: 3000});
        this.newCategoryName.set('');
        this.loadCategories();
      },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000})
    });
  }

  deleteCategory(id: string): void {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Catégorie supprimée !', 'Fermer', {duration: 3000});
        this.loadCategories();
      },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000})
    });
  }

  toggleMaintenance(): void {
    const current = this.siteConfigService.config()?.isMaintenanceMode ?? false;
    this.siteConfigService.updateMaintenance({isMaintenanceMode: !current}).subscribe({
      next: (config) => {
        this.siteConfigService.config.set(config);
        this.snackBar.open(
          config.isMaintenanceMode ? 'Site en maintenance !' : 'Site en ligne !',
          'Fermer', {duration: 3000}
        );
      },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000})
    });
  }

  saveAlertMessage(): void {
    this.siteConfigService.updateAlert({globalAlertMessage: this.alertMessage() || undefined}).subscribe({
      next: (config) => {
        this.siteConfigService.config.set(config);
        this.snackBar.open('Message d\'alerte mis à jour !', 'Fermer', {duration: 3000});
      },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000})
    });
  }

  clearAlertMessage(): void {
    this.alertMessage.set('');
    this.siteConfigService.updateAlert({globalAlertMessage: undefined}).subscribe({
      next: (config) => {
        this.siteConfigService.config.set(config);
        this.snackBar.open('Message d\'alerte supprimé !', 'Fermer', {duration: 3000});
      }
    });
  }
}

