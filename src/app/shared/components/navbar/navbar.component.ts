import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { GlobalSearchService, SearchResultGroup } from '../../../core/services/globalSearch/globalsearch.service';
import { User } from '../../models/user.model';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SidebarService } from '../sidebar/service/sidebar.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatMenuTrigger, NotificationBellComponent, MatButtonModule,FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  currentUser!: User | null;
  pageTitle = 'Dashboard';
  searchOpen = false;
  groupedResults: SearchResultGroup[] = [];

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('mobileSearchInput') mobileSearchInput?: ElementRef<HTMLInputElement>;

  private searchTerm$ = new Subject<string>();
    searchTerm = '';


  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private searchService: GlobalSearchService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sidebarService: SidebarService,
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    this.setPageTitle();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.setPageTitle());

    this.searchTerm$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => this.searchService.searchAll(term))
      )
      .subscribe((groups) => (this.groupedResults = groups));
  }

  private setPageTitle() {
    let route = this.activatedRoute.root;
    while (route.firstChild) route = route.firstChild;
    this.pageTitle = route.snapshot.data['title'] ?? 'Dashboard';
  }

  // onSearchInput(value: string) {
  //   if (!value.trim()) {
  //     this.groupedResults = [];
  //     return;
  //   }
  //   this.searchTerm$.next(value);
  // }

  // goToResult(route: string) {
  //   this.router.navigate([route]);
  //   this.groupedResults = [];
  //   this.searchOpen = false;
  //   if (this.searchInput) this.searchInput.nativeElement.value = '';
  //   if (this.mobileSearchInput) this.mobileSearchInput.nativeElement.value = '';
  // }

  getInitials(name?: string | null): string {
    if (!name) return '?';
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.notificationService.success('Successfully logged out. See you soon!');
    this.router.navigate(['/login']);
  }

  navProfile() {
    console.log('Comming Soon');
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    if (this.searchOpen) {
      setTimeout(() => this.searchInput?.nativeElement.focus());
    } else {
      this.groupedResults = [];
    }
  }

  // onSearchBlur() {
  //   const hasValue = this.searchInput?.nativeElement.value || this.mobileSearchInput?.nativeElement.value;
  //   if (!hasValue) {
  //     this.searchOpen = false;
  //     this.groupedResults = [];
  //   }
  // }


// groupedResults: SearchResultGroup[] = [];

onSearchInput(value: string) {
  this.searchTerm = value;
  if (!value.trim()) {
    this.groupedResults = [];
    return;
  }
  this.searchTerm$.next(value);
}

goToResult(route: string) {
  this.router.navigate([route]);
  this.closeSearch();
}

closeSearch() {
  this.searchOpen = false;
  this.searchTerm = '';
  this.groupedResults = [];
}

onSearchBlur() {
  if (!this.searchTerm) {
    this.searchOpen = false;
  }
}

@HostListener('window:resize')
onWindowResize() {
  if (window.innerWidth > 640 && this.searchOpen) {
    this.closeSearch();
  }
}
}